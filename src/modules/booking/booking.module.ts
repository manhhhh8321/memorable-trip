import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { RoomModule } from '../room/room.module';
import { UserModule } from '../user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking, BookingDate, Discount } from 'src/entities';
import { BookingsRepository } from './booking.repositoty';
import { PaymentModule } from '../payment/payment.module';

@Module({
  imports: [TypeOrmModule.forFeature([BookingDate, Discount, Booking]), RoomModule, UserModule, PaymentModule],
  controllers: [BookingController],
  providers: [BookingService, BookingsRepository],
  exports: [BookingService],
})
export class BookingModule {}
