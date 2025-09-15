import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateSuperheroDto } from './dto/create-superhero.dto';
import { PrismaService } from 'src/database/prisma.service';
import { GetSuperheroesQueryDto } from './dto/get-superheroes-query.dto';
import { UpdateSuperheroDto } from './dto/update-superhero.dto';
import { MinioService } from 'src/minio/minio.service';

@Injectable()
export class SuperheroesService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly minioService: MinioService,
  ) {}
  async create(superhero: CreateSuperheroDto, files?: Express.Multer.File[]) {
    try {
      const uploadedFiles: string[] = [];
      if (files && files.length > 0) {
        const uploadedFileNames = await this.minioService.uploadFiles(
          superhero.nickname,
          files,
        );
        console.log('Uploaded file names:', uploadedFileNames);
        uploadedFiles.push(...uploadedFileNames);
      }
      const hero = await this.prismaService.superhero.create({
        data: { ...superhero, images: uploadedFiles },
      });
      return hero;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException(
          'Hero with such nickname is already exists',
        );
      }
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async findAll(query: GetSuperheroesQueryDto) {
    const skip = (query.page - 1) * query.limit;

    const where: Record<string, any> = {};
    if (query.search) {
      where.OR = [
        { nickname: { contains: query.search, mode: 'insensitive' } },
        { real_name: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    if (query.superpowers && query.superpowers.length > 0) {
      where.superpowers = {
        hasSome: query.superpowers,
      };
    }
    const [superheroes, total] = await Promise.all([
      this.prismaService.superhero.findMany({
        take: query.limit,
        skip,
        where,
        orderBy: {
          [query.sortBy]: query.sortOrder,
        },
      }),
      this.prismaService.superhero.count({ where }),
    ]);

    const updatedHeroes = await Promise.all(
      superheroes.map(async (hero) => {
        const imageLinks = await Promise.all(
          hero.images.map((image) =>
            this.minioService.getPresignedUrl(hero.nickname, image),
          ),
        );
        return { ...hero, images: imageLinks };
      }),
    );

    return {
      data: updatedHeroes,
      total,
      page: query.page,
      last_page: Math.ceil(total / query.limit) || 1,
    };
  }

  async findOne(id: string) {
    const foundHero = await this.prismaService.superhero.findUnique({
      where: { id },
    });

    const presignedLinks: string[] = [];

    if (foundHero?.images) {
      const res = await Promise.all(
        foundHero.images.map((image) => {
          return this.minioService.getPresignedUrl(foundHero.nickname, image);
        }),
      ).then((links) => links.filter((link) => link !== null));
      presignedLinks.push(...res);
    }

    return { ...foundHero, images: presignedLinks };
  }

  async update(
    id: string,
    superhero: UpdateSuperheroDto,
    files?: Express.Multer.File[],
  ) {
    const { removedImages, ...rest } = superhero;
    const existingHero = await this.prismaService.superhero.findUnique({
      where: { id },
    });
    if (!existingHero) {
      throw new InternalServerErrorException('Superhero not found');
    }
    if (superhero.nickname && existingHero.nickname !== superhero.nickname) {
      await this.minioService.renameFile(
        existingHero.nickname,
        superhero.nickname,
      );
    }
    const clearedImages: string[] = [];
    const uploadedFiles: string[] = [];
    if (removedImages && rest.images) {
      console.log('Existing images:', rest.images);
      clearedImages.push(
        ...rest.images.filter((img) => !removedImages.includes(img)),
      );
    } else {
      console.log('No images to remove or no existing images');
      clearedImages.push(...(rest.images || []));
    }

    if (
      superhero.images &&
      removedImages &&
      removedImages.length > 0 &&
      superhero.nickname
    ) {
      try {
        await this.minioService.deleteFiles(superhero.nickname, removedImages);
      } catch (error) {
        throw new InternalServerErrorException(
          'Failed to delete images from storage',
        );
      }
    }
    if (files && files.length > 0 && superhero.nickname) {
      console.log('Uploading new images:', files.length);
      const uploadedFileNames = await this.minioService.uploadFiles(
        superhero.nickname,
        files,
      );
      uploadedFiles.push(...uploadedFileNames);
    }
    return this.prismaService.superhero.update({
      where: { id },
      data: { ...rest, images: [...clearedImages, ...uploadedFiles] },
    });
  }

  async remove(id: string) {
    const hero = await this.prismaService.superhero.findFirst({
      where: { id },
    });
    if (hero?.images && hero.images.length > 0) {
      try {
        await this.minioService.deleteFiles(hero.nickname, hero.images);
      } catch (error) {
        throw new InternalServerErrorException(
          'Failed to delete images from storage',
        );
      }
    }
    return this.prismaService.superhero.delete({ where: { id } });
  }
}
