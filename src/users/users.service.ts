import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetUsersQueryDto } from './dto/get-user-query.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(userQuery: GetUsersQueryDto) {
    return this.prismaService.user.findMany({
      take: userQuery.limit,
      skip:
        userQuery.limit && userQuery.page
          ? (userQuery.page - 1) * userQuery.limit
          : undefined,
      where: userQuery.search
        ? {
            OR: [
              { username: { contains: userQuery.search } },
              { email: { contains: userQuery.search } },
            ],
          }
        : undefined,
    });
  }
  async findById(id: string) {
    const user = await this.prismaService.user.findFirst({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
  async findByUsername(username: string) {
    const user = await this.prismaService.user.findFirst({
      where: { username },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
  async findByEmail(email: string) {
    const user = await this.prismaService.user.findFirst({
      where: { email },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
  async create(userData: CreateUserDto) {
    try {
      const user = await this.prismaService.user.create({
        data: {
          ...userData,
          password: await bcrypt.hash(userData.password, 10),
        },
      });
      return user;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException(
          'User with this email or username already exists',
        );
      }
      throw new InternalServerErrorException('Something went wrong');
    }
  }
  async update(id: string, userData: UpdateUserDto) {
    return this.prismaService.user.update({
      where: { id },
      data: { ...userData },
    });
  }
  async delete(id: string) {
    return this.prismaService.user.delete({ where: { id } });
  }
}
