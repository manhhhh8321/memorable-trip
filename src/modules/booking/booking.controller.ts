import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query } from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { AuthGuard } from 'src/common/guards/authenticate.guard';
import { Auth } from 'src/common/decorators/auth.decorator';
import { UserType } from 'src/enums/user.enum';
import { UserService } from '../user/user.service';

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService, private readonly userService: UserService) {}

  @UseGuards(AuthGuard)
  @Auth([
    {
      userType: UserType.CLIENT,
    },
    {
      userType: UserType.OWNER,
    },
  ])
  @Post()
  create(@Body() createBookingDto: CreateBookingDto, @Req() req: any) {
    const customerId = req.user.id;
    return this.bookingService.createBooking(customerId, createBookingDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  @Auth([
    {
      userType: UserType.ADMIN,
    },
    {
      userType: UserType.CLIENT,
    },
    {
      userType: UserType.OWNER,
    },
  ])
  async findAll(@Query('page') page: number, @Query('limit') limit: number, @Req() req: any) {
    const userId = req.user.id;
    page ? page : (page = 1);
    limit ? limit : (limit = 10);
    const user = await this.userService.findById(userId);

    if (user.userType === UserType.ADMIN) {
      return this.bookingService.findAll(page, limit);
    }

    return this.bookingService.findAllByUserId(userId, page, limit);
  }

  @Get('/owner')
  @UseGuards(AuthGuard)
  @Auth([
    {
      userType: UserType.OWNER,
    },
  ])
  async findAllBooked(@Query('page') page: number, @Query('limit') limit: number, @Req() req: any) {
    const userId = req.user.id;
    page ? page : (page = 1);
    limit ? limit : (limit = 10);
    return this.bookingService.findAllBooked(userId, page, limit);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookingService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBookingDto: UpdateBookingDto) {
    return this.bookingService.update(+id, updateBookingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookingService.remove(+id);
  }
}
