import { InjectRedis, Redis } from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RedisService {
  constructor(@InjectRedis() private readonly redisClient: Redis) {}

  async get(key: string) {
    return await this.redisClient.get(key);
  }

  async set(key: string, value: string) {
    return await this.redisClient.set(key, value);
  }

  async del(key: string) {
    return await this.redisClient.del(key);
  }
}
