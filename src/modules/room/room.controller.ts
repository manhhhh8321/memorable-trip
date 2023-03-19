import { Body, Controller, Get, Post } from '@nestjs/common';
import { DescriptionService } from '../description/description.service';
import { RoomDto } from './dto/room.dto';
import { RoomService } from './room.service';

@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService, private readonly descriptionService: DescriptionService) {}

  @Get('seedDescription')
  async seed() {
    return await this.descriptionService.seedDescription();
  }

  @Get('seedCity')
  async seedCity() {
    return await this.roomService.seedCity();
  }

  // @Get('seedRoom')
  // async seedRoom() {
  //   return await this.roomService.seedRoom();
  // }

  @Post('')
  async create(@Body() payload: RoomDto) {
    return await this.roomService.create(payload);
  }
}
