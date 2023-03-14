import { Controller, Get } from '@nestjs/common';
import { DescriptionService } from '../description/description.service';
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
}
