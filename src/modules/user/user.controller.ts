import { Body, Controller, Get, Post } from '@nestjs/common';
import { HttpCode, Param, Put, Req, UseGuards } from '@nestjs/common/decorators';
import { Auth } from 'src/common/decorators/auth.decorator';
import { AuthGuard } from 'src/common/guards/authenticate.guard';
import { UserType } from 'src/enums/user.enum';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UseGuards(AuthGuard)
  @Auth([
    {
      userType: UserType.ADMIN,
    },
  ])
  @HttpCode(201)
  async createUser(@Body() payload: CreateUserDto) {
    return await this.userService.createUser(payload);
  }

  @Get('')
  @UseGuards(AuthGuard)
  @Auth([
    {
      userType: UserType.CLIENT,
    },
    {
      userType: UserType.CLIENT,
    },
  ])
  async findById(@Req() req: any) {
    const userId = req.user.id;
    return await this.userService.findById(userId);
  }

  @Put('')
  @UseGuards(AuthGuard)
  @Auth([
    {
      userType: UserType.CLIENT,
    },
    {
      userType: UserType.OWNER,
    },
  ])
  async updateUser(@Req() req: any, @Body() payload: UpdateUserDto) {
    const userId = req.user.id;
    return await this.userService.updateUser(userId, payload);
  }

  @Get('/seed')
  async seed() {
    return await this.userService.seedUser();
  }
}
