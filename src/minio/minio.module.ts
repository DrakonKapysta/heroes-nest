import { Module, DynamicModule } from '@nestjs/common';
import { MinioService } from './minio.service';
import * as Minio from 'minio';
import { MINIO_CLIENT } from './minio.constants';
import { MinioController } from './minio.controller';

export interface MinioModuleOptions {
  endPoint: string;
  port: number;
  useSSL: boolean;
  accessKey: string;
  secretKey: string;
}

export interface MinioModuleAsyncOptions {
  imports?: any[];
  inject?: any[];
  useFactory: (...args: any[]) => MinioModuleOptions;
}

@Module({
  controllers: [MinioController],
})
export class MinioModule {
  static registerAsync(options: MinioModuleAsyncOptions): DynamicModule {
    return {
      module: MinioModule,
      imports: options.imports || [],
      providers: [
        {
          provide: MINIO_CLIENT,
          useFactory: async (...args: any[]) => {
            const opts: MinioModuleOptions = await options.useFactory(...args);
            return new Minio.Client({
              endPoint: opts.endPoint,
              port: opts.port,
              useSSL: opts.useSSL,
              accessKey: opts.accessKey,
              secretKey: opts.secretKey,
            });
          },
          inject: options.inject || [],
        },
        MinioService,
      ],
      exports: [MinioService],
    };
  }
}
