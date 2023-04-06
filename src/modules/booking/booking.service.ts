import { Injectable } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { Booking, BookingDate, Discount, RoomDiscount } from 'src/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Brackets, In, LessThanOrEqual, MoreThanOrEqual, Not, Repository } from 'typeorm';
import { RoomService } from '../room/room.service';
import { BookingsRepository } from './booking.repositoty';
import { ErrorHelper } from 'src/helpers/error.utils';
import { UserService } from '../user/user.service';
import { USER_MESSAGE } from 'src/constants/message.constant';
import { BookingStatusEnum, UserType } from 'src/enums/user.enum';
import { PaymentService } from '../payment/payment.service';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(BookingDate) private readonly bookingDateRepo: Repository<BookingDate>,
    private readonly roomService: RoomService,
    private readonly bookingRepo: BookingsRepository,
    private readonly userService: UserService,
    @InjectRepository(Discount) private readonly discountRepo: Repository<Discount>,
    private readonly paymentService: PaymentService,
  ) {}
  async createBooking(customerId: number, payload: CreateBookingDto): Promise<Booking> {
    const { checkIn, checkOut, roomId, paymentType, note } = payload;
    const isUserValid = await this.userService.findById(customerId);

    if (!isUserValid) {
      ErrorHelper.BadRequestException(USER_MESSAGE.USER_NOT_FOUND);
    }

    if (checkIn > checkOut || checkIn === checkOut) {
      ErrorHelper.BadRequestException('Check-in date must be before check-out date');
    }

    if (isUserValid.userType === UserType.ADMIN) {
      ErrorHelper.BadRequestException('Admin cannot book room');
    }

    if (isUserValid.isVerified === false) {
      ErrorHelper.BadRequestException('User is not verified');
    }

    const isRoomAvailable = await this.bookingDateRepo
      .createQueryBuilder('bookingDate')
      .leftJoinAndSelect('bookingDate.room', 'room')
      .where('room.id = :roomId', { roomId })
      .andWhere('bookingDate.isAvailable = :isAvailable', { isAvailable: false })
      .andWhere(
        new Brackets((qb) => {
          qb.where(':checkIn BETWEEN bookingDate.checkIn AND bookingDate.checkOut')
            .orWhere(':checkOut BETWEEN bookingDate.checkIn AND bookingDate.checkOut')
            .orWhere(
              new Brackets((qb) => {
                qb.where('bookingDate.checkIn BETWEEN :checkIn AND :checkOut').orWhere(
                  'bookingDate.checkOut BETWEEN :checkIn AND :checkOut',
                );
              }),
            );
        }),
        { checkIn, checkOut },
      )
      .getCount();

    if (isRoomAvailable > 0) {
      ErrorHelper.BadRequestException('Room is not available for the requested dates');
    }

    const room = await this.roomService.findById(roomId);
    const duration = this.calculateDuration(checkIn, checkOut);

    const { totalPrice, totalDiscount } = await this.calculateTotalPrice(room.price, duration, roomId);

    const bookingDate = this.bookingDateRepo.create({
      room,
      checkIn,
      checkOut,
      isAvailable: false,
      duration,
    });

    await this.bookingDateRepo.save(bookingDate);

    const payment = await this.paymentService.create(paymentType);

    const booking = await this.bookingRepo.create({
      user: isUserValid,
      bookingDate: bookingDate,
      note,
      status: BookingStatusEnum.BOOKED,
      totalDiscount,
      totalPrice,
      payment,
    });

    return booking;
  }

  calculateDuration(checkIn: Date, checkOut: Date): string {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    // Calculate the duration in milliseconds
    const durationMs = Math.abs(checkInDate.getTime() - checkOutDate.getTime());

    // Convert the duration to days
    const durationDays = Math.ceil(durationMs / (1000 * 60 * 60 * 24));

    // Format the duration in a human-readable format
    const durationString = durationDays === 1 ? 'night' : 'nights';
    return `${durationDays} ${durationString}`;
  }

  async calculateTotalPrice(price: number, duration: string, roomId: number) {
    // Get the room with the given ID
    const room = await this.roomService.findById(roomId);

    // Find all discounts for the given room
    const roomDiscounts = await this.discountRepo
      .createQueryBuilder('discount')
      .where('discount.dueDate >= :now', { now: new Date() })
      .leftJoinAndSelect('discount.roomDiscount', 'roomDiscount')
      .andWhere('roomDiscount.roomId = :roomId', { roomId: room.id })
      .getMany();

    let totalDiscount = 0;

    // If the room has any discounts, calculate the total discount percentage
    if (roomDiscounts.length > 0) {
      totalDiscount = roomDiscounts.reduce((total, discount) => {
        // Find the room discount for the given room
        const roomDiscount = discount.roomDiscount.find((roomDiscount) => roomDiscount.roomId === room.id);

        // If the room discount exists, add the discount percentage to the total
        if (roomDiscount) {
          return total + total * (roomDiscount.percentage / 100);
        }

        // If the room discount doesn't exist, return the total
        return total;
      }, 0);
    }

    // Calculate the discounted price if there is any discount, else use the regular price
    const discountedPrice = totalDiscount > 0 ? price - (price * totalDiscount) / 100 : price;

    // Calculate the total price by multiplying the discounted price with the duration
    return {
      totalDiscount,
      totalPrice: discountedPrice * Number(duration.split(' ')[0]),
    };
  }

  findAll() {
    return `This action returns all booking`;
  }

  findOne(id: number) {
    return `This action returns a #${id} booking`;
  }

  update(id: number, updateBookingDto: UpdateBookingDto) {
    return `This action updates a #${id} booking`;
  }

  remove(id: number) {
    return `This action removes a #${id} booking`;
  }
}
