import {
  Inject,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { REDIS_CLIENT } from './redis.constants';
import { RedisClientType } from 'redis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  constructor(
    @Inject(REDIS_CLIENT) private readonly redisClient: RedisClientType,
  ) {}
  async onModuleInit() {
    await this.redisClient.connect();
  }
  async onModuleDestroy() {
    await this.redisClient.quit();
  }
  async checkConnection(): Promise<string> {
    return this.redisClient.ping();
  }

  async checkCashe(key: string): Promise<string | null> {
    return this.redisClient.get(key);
  }

  async setWithExparingTime(
    key: string,
    value: string,
    expiringTime: number,
  ): Promise<string | null> {
    return this.redisClient.set(key, value, { EX: expiringTime });
  }
  async removeFromCache(key: string): Promise<number> {
    return this.redisClient.del(key);
  }
}
