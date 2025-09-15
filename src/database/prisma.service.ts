import {
  Injectable,
  Logger,
  NotFoundException,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super();
    this.$extends({
      query: {
        $allOperations: async ({ operation, args, query, model }) => {
          const stat = Date.now();
          const result = await query(args);
          const end = Date.now();
          this.logger.log(
            `Prisma query ${model}.${operation} took ${end - stat} ms`,
          );
          return result;
        },
      },
    });
  }

  async onModuleInit() {
    try {
      await this.$connect();
    } catch (error) {
      throw new NotFoundException('Database connection error');
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
