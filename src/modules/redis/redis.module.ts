import { RedisModule } from '@nestjs-modules/ioredis';
import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';

@Module({
  imports: [
    RedisModule.forRoot({
      config: {
        url: 'redis://localhost:6379',
      },
    }),
  ],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModuleCache {}
