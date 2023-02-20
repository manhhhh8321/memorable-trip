import { Body, Controller, Get, Post } from '@nestjs/common';
import { HttpCode } from '@nestjs/common/decorators';
import { CreateUserDto } from './dto/user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @HttpCode(201)
  async createUser(@Body() payload: CreateUserDto) {
    return await this.userService.createUser(payload);
  }
}
