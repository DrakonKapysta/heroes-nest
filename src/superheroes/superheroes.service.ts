import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateSuperheroDto } from './dto/create-superhero.dto';
import { PrismaService } from 'src/database/prisma.service';
import { GetSuperheroesQueryDto } from './dto/get-superheroes-query.dto';
import { UpdateSuperheroDto } from './dto/update-superhero.dto';

@Injectable()
export class SuperheroesService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(superhero: CreateSuperheroDto) {
    try {
      const hero = await this.prismaService.superhero.create({
        // TODO: add file upload to minio bucket and just save the URLs in DB
        data: { ...superhero, images: [] },
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

    return {
      data: superheroes,
      total,
      page: query.page,
      last_page: Math.ceil(total / query.limit) || 1,
    };
  }

  async findOne(id: string) {
    return this.prismaService.superhero.findUnique({ where: { id } });
  }

  async update(id: string, superhero: UpdateSuperheroDto) {
    // update images in minio bucket and just save the URLs in DB
    return this.prismaService.superhero.update({
      where: { id },
      data: { ...superhero, images: [] },
    });
  }

  async remove(id: string) {
    return this.prismaService.superhero.delete({ where: { id } });
  }
}
