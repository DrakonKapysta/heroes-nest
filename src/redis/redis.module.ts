import { DynamicModule, Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { REDIS_CLIENT } from './redis.constants';
import { createClient, RedisClientOptions } from 'redis';
import { RedisController } from './redis.controller';

export interface RedisModuleAsyncOptions {
  imports?: any[];
  inject?: any[];
  useFactory: (...args: any[]) => RedisClientOptions;
}
@Module({
  providers: [RedisService],
  controllers: [RedisController],
})
export class RedisModule {
  static registerAsync(options: RedisModuleAsyncOptions): DynamicModule {
    return {
      module: RedisModule,
      imports: options.imports || [],
      providers: [
        {
          provide: REDIS_CLIENT,
          useFactory: (...args: any[]) => {
            const opts = options.useFactory(...args);
            return createClient({
              url: opts.url,
            });
          },
          inject: options.inject || [],
        },
        RedisService,
      ],

      exports: [RedisService],
    };
  }
}
