import { Injectable } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { Booking, BookingDate, Discount, RoomDiscount } from 'src/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, MoreThanOrEqual, Not, Repository } from 'typeorm';
import { RoomService } from '../room/room.service';
import { BookingRepository } from './booking.repositoty';
import { ErrorHelper } from 'src/helpers/error.utils';
import { UserService } from '../user/user.service';
import { USER_MESSAGE } from 'src/constants/message.constant';
import { BookingStatusEnum, UserType } from 'src/enums/user.enum';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(BookingDate) private readonly bookingDateRepo: Repository<BookingDate>,
    private readonly roomService: RoomService,
    @InjectRepository(Booking) private readonly bookingRepo: BookingRepository,
    private readonly userService: UserService,
    @InjectRepository(Discount) private readonly discountRepo: Repository<Discount>,
  ) {}
  async createBooking(payload: CreateBookingDto): Promise<Booking> {
    const { checkIn, checkOut, customerId, roomId, paymentType, note } = payload;
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
    // Check if room is available for the requested check-in and check-out dates
    const availableRooms = await this.roomService.find({
      where: {
        isActive: true,
        bookingDates: {
          // Find all booking dates that overlap with the requested dates
          where: {
            isAvailable: false,
            checkIn: LessThanOrEqual(checkOut),
            checkOut: MoreThanOrEqual(checkIn),
          },
          // Don't return the booking dates themselves, just the room IDs
          select: ['roomId'],
        },
      },
    });

    const bookedRoomIds = availableRooms.map((room) => room.bookingDate[0].room.id);

    // Find all rooms that are active and do not have any overlapping booking dates
    const rooms = await this.roomService.find({
      where: {
        isActive: true,
        id: Not(bookedRoomIds),
      },
    });

    // If no available rooms were found, throw an error
    if (rooms.length === 0) {
      ErrorHelper.BadRequestException('No available rooms for the requested dates');
    }

    const room = await this.roomService.findById(roomId);
    const duration = this.calculateDuration(checkIn, checkOut);
    const { totalPrice, totalDiscount } = await this.calculateTotalPrice(room.price, duration, roomId);

    const bookingDate = this.bookingDateRepo.create({
      room,
      checkIn,
      checkOut,
      isAvailable: false,
    });

    await this.bookingDateRepo.save(bookingDate);

    const booking = await this.bookingRepo.create({
      user: isUserValid,
      bookingDate: bookingDate,
      note,
      status: BookingStatusEnum.BOOKED,
      totalDiscount,
      totalPrice,
    });

    return booking;
  }

  calculateDuration(checkIn: Date, checkOut: Date): string {
    // Calculate the duration in milliseconds
    const durationMs = Math.abs(checkOut.getTime() - checkIn.getTime());

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
    const roomDiscounts = await this.discountRepo.find({
      where: {
        dueDate: MoreThanOrEqual(new Date()),
        roomDiscounts: {
          where: {
            roomId: room.id,
          },
        },
      },
      relations: ['roomDiscounts'],
    });

    let totalDiscount = 0;

    // If the room has any discounts, calculate the total discount percentage
    if (roomDiscounts.length > 0) {
      totalDiscount = roomDiscounts.reduce((total, discount) => {
        // Find the room discount for the given room
        const roomDiscount = discount.roomDiscount.find((roomDiscount) => roomDiscount.room.id === room.id);

        // If the room discount exists, add the discount percentage to the total
        if (roomDiscount) {
          return total + roomDiscount.percentage;
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
