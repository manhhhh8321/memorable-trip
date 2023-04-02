import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { RoomModule } from '../room/room.module';
import { UserModule } from '../user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking, BookingDate, Discount } from 'src/entities';
import { BookingRepository } from './booking.repositoty';

@Module({
  imports: [TypeOrmModule.forFeature([BookingDate, Discount, Booking]), RoomModule, UserModule],
  controllers: [BookingController],
  providers: [BookingService],
  exports: [BookingService],
})
export class BookingModule {}
