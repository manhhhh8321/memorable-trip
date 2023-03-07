import { Body, Controller, Get, Post } from '@nestjs/common';
import { HttpCode, UseGuards } from '@nestjs/common/decorators';
import { Auth } from 'src/common/decorators/auth.decorator';
import { AuthGuard } from 'src/common/guards/authenticate.guard';
import { UserType } from 'src/enums/user.enum';
import { CreateUserDto } from './dto/user.dto';
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
}
