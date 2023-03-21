import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { Auth } from 'src/common/decorators/auth.decorator';
import { AuthGuard } from 'src/common/guards/authenticate.guard';
import { UserType } from 'src/enums/user.enum';
import { DescriptionService } from '../description/description.service';
import { RoomDto } from './dto/room.dto';
import { RoomService } from './room.service';

import { Request } from '@nestjs/common';
import { UserService } from '../user/user.service';

@Controller('room')
export class RoomController {
  constructor(
    private readonly roomService: RoomService,
    private readonly descriptionService: DescriptionService,
    private readonly userService: UserService,
  ) {}

  @Get('')
  @UseGuards(AuthGuard)
  @Auth([
    {
      userType: UserType.ADMIN,
    },
  ])
  async getAll(@Query('page', new ParseIntPipe()) page: number, @Query('limit', new ParseIntPipe()) limit: number) {
    return await this.roomService.getAll({
      page,
      limit,
    });
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @Auth([
    {
      userType: UserType.CLIENT,
    },
    {
      userType: UserType.OWNER,
    },
    {
      userType: UserType.ADMIN,
    },
  ])
  async getById(@Param('id', new ParseIntPipe()) id: number) {
    return await this.roomService.findById(id);
  }

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
  @UseGuards(AuthGuard)
  @Auth([
    {
      userType: UserType.CLIENT,
    },
    {
      userType: UserType.OWNER,
    },
    {
      userType: UserType.ADMIN,
    },
  ])
  async create(@Body() payload: RoomDto, @Req() req: any) {
    return await this.roomService.create(payload);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  @Auth([
    {
      userType: UserType.CLIENT,
    },
    {
      userType: UserType.OWNER,
    },
    {
      userType: UserType.ADMIN,
    },
  ])
  async update(@Param('id', new ParseIntPipe()) id: number, @Body() payload: RoomDto, @Req() req: any) {
    const userId = req.user.id;

    const user = await this.userService.findById(userId);

    if (user.userType === UserType.ADMIN) {
      return await this.roomService.updateRoom(id, payload);
    }

    return await this.roomService.updateRoom(id, payload, userId);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @Auth([
    {
      userType: UserType.CLIENT,
    },
    {
      userType: UserType.OWNER,
    },
    {
      userType: UserType.ADMIN,
    },
  ])
  async delete(@Param('id', new ParseIntPipe()) id: number, @Req() req: any) {
    const userId = req.user.id;

    const user = await this.userService.findById(userId);

    if (user.userType === UserType.ADMIN) {
      return await this.roomService.deleteRoom(id);
    }

    return await this.roomService.deleteRoom(id, userId);
  }
}
