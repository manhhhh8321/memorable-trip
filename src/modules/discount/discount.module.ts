import { Module } from '@nestjs/common';
import { DiscountService } from './discount.service';
import { DiscountController } from './discount.controller';
import { RoomModule } from '../room/room.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Discount, RoomDiscount } from 'src/entities';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Discount, RoomDiscount]), RoomModule, UserModule],
  controllers: [DiscountController],
  providers: [DiscountService],
})
export class DiscountModule {}
