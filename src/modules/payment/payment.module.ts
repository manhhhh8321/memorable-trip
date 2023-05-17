import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from 'src/entities';
import { PaymentsRepository } from './payment.repository';
import { BookingModule } from '../booking/booking.module';
import { RedisModule } from '@nestjs-modules/ioredis';
import { RedisModuleCache } from '../redis/redis.module';

@Module({
  imports: [TypeOrmModule.forFeature([Payment]), RedisModuleCache],
  controllers: [PaymentController],
  providers: [PaymentService, PaymentsRepository],
  exports: [PaymentService],
})
export class PaymentModule {}
