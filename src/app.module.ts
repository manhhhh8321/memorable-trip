import { Module } from '@nestjs/common';

import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from './shared/config/config.module';
import { DatabaseModule } from './modules/database/database.module';
import { UserModule } from './modules/user/user.module';
import { RedisModuleCache } from './modules/redis/redis.module';
import { RoomModule } from './modules/room/room.module';
import { AmenitiesModule } from './modules/amenities/amenities.module';
import { ImageKitModule } from './modules/imageKit/imagekit.module';
import { BookingModule } from './modules/booking/booking.module';
@Module({
  imports: [AuthModule, ConfigModule, DatabaseModule, RoomModule, AmenitiesModule, ImageKitModule, BookingModule],
})
export class AppModule {}
