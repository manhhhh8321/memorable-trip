import { Controller, Post, Body, Res, Get } from '@nestjs/common';
import { Response } from 'express';
import { ResponseMessage } from 'src/common/decorators/user.decorator';
import { CreateUserDto } from '../user/dto/user.dto';
import { UserService } from '../user/user.service';

import { AuthService } from './auth.service';
import { LoginDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly userService: UserService) {}

  @Get('ping')
  async ping() {
    return 'PONG';
  }

  @Post('login')
  async login(@Body() payload: LoginDto, @Res() res: Response) {
    const { accessToken, refreshToken, expires } = await this.authService.login(payload);
    res.cookie('JWT', 'Bearer ' + accessToken, {
      maxAge: expires,
      httpOnly: true,
    });
    res.json({ accessToken, refreshToken });
    return { accessToken, refreshToken };
  }

  @Post('register')
  async register(@Body() payload: CreateUserDto) {
    const result = await this.userService.createUser(payload);

    return {
      result,
      message: 'Register successfully',
    };
  }
}
