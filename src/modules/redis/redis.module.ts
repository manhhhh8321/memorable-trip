import { RedisModule } from '@nestjs-modules/ioredis';
import { Module } from '@nestjs/common';
import { REDIS_URL } from 'src/environments';
import { RedisService } from './redis.service';

@Module({
  imports: [
    RedisModule.forRoot({
      config: {
        url: REDIS_URL,
      },
    }),
  ],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModuleCache {}
