import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { AuthGuard } from 'src/common/guards/authenticate.guard';
import { Auth } from 'src/common/decorators/auth.decorator';
import { UserType } from 'src/enums/user.enum';

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

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
  findAll() {
    return this.bookingService.findAll();
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
