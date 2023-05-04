import { Test, TestingModule } from '@nestjs/testing';
import { DiscountController } from './discount.controller';
import { DiscountService } from './discount.service';
import { RoomService } from '../room/room.service';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Amenities, Discount, Room, RoomDiscount } from 'src/entities';
import { RoomModule } from '../room/room.module';
import { UserModule } from '../user/user.module';
import { City } from 'src/entities/city.entity';
import { createMock } from '@golevelup/ts-jest';

describe('DiscountController', () => {
  let controller: DiscountController;
  let discountService: DiscountService;
  let roomService: RoomService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [RoomModule, UserModule, TypeOrmModule.forFeature([Discount, RoomDiscount, Room, City])],
      controllers: [DiscountController],
      providers: [DiscountService],
    })
      .useMocker(() => createMock())
      .compile();

    controller = module.get<DiscountController>(DiscountController);
    discountService = module.get<DiscountService>(DiscountService);
    roomService = module.get<RoomService>(RoomService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
