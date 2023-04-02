import { Injectable } from '@nestjs/common';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { UpdateDiscountDto } from './dto/update-discount.dto';
import { RoomService } from '../room/room.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Discount, RoomDiscount } from 'src/entities';
import { Repository } from 'typeorm';
import { ErrorHelper } from 'src/helpers/error.utils';
import { ROOM_MESSAGE } from 'src/constants/message.constant';
import moment from 'moment';

@Injectable()
export class DiscountService {
  constructor(
    private readonly roomService: RoomService,
    @InjectRepository(Discount) private readonly discountRepo: Repository<Discount>,
    @InjectRepository(RoomDiscount) private readonly roomDiscountRepo: Repository<RoomDiscount>,
  ) {}
  async create(userId: number, createDiscountDto: CreateDiscountDto) {
    const { dueDate, name, roomId, isExpired, percentage } = createDiscountDto;
    const room = await this.roomService.findById(roomId);

    if (!room) {
      ErrorHelper.BadRequestException(ROOM_MESSAGE.GET.NOT_FOUND);
    }

    if (isExpired() === true) {
      ErrorHelper.BadRequestException('Discount is expired');
    }

    const discount = this.discountRepo.create({
      dueDate,
      name,
    });

    await this.discountRepo.save(discount);

    const roomDiscount = this.roomDiscountRepo.create({
      roomId,
      discountId: discount.id,
      percentage,
    });

    return await this.roomDiscountRepo.save(roomDiscount);
  }

  async findAll(userId?: number) {
    const where = userId ? { userId } : {};
    return await this.discountRepo.find({ where });
  }

  async update(id: number, updateDiscountDto: UpdateDiscountDto) {
    const { name, dueDate } = updateDiscountDto;
    const discount = await this.discountRepo.findOne(id);

    if (!discount) {
      ErrorHelper.BadRequestException(`Discount with ID ${id} not found`);
    }

    // Check if the new due date is not already expired
    if (new Date(dueDate) < new Date() && discount.dueDate < new Date()) {
      ErrorHelper.BadRequestException('Discount is already expired');
    }

    // Update the discount's name and due date
    discount.name = name;
    discount.dueDate = dueDate;
    return await this.discountRepo.save(discount);
  }

  async remove(id: number) {
    const discount = await this.discountRepo.findOne(id);

    if (!discount) {
      ErrorHelper.BadRequestException(`Discount with ID ${id} not found`);
    }

    return await this.discountRepo.remove(discount);
  }
}
