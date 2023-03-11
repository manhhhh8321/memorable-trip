import { Module } from '@nestjs/common';

import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from './shared/config/config.module';
import { DatabaseModule } from './modules/database/database.module';
import { UserModule } from './modules/user/user.module';
import { RedisModuleCache } from './modules/redis/redis.module';
import { RoomModule } from './modules/room/room.module';

@Module({
  imports: [AuthModule, ConfigModule, DatabaseModule, RoomModule],
})
export class AppModule {}
