import { Controller, Post, Body, Res, Get, HttpCode } from '@nestjs/common';
import { Response } from 'express';
import { ResponseMessage } from 'src/common/decorators/user.decorator';
import { ValidationPipe } from 'src/common/pipes/validation.pipe';
import { MAIL_MESSAGE, USER_MESSAGE } from 'src/constants/message.constant';
import { ErrorHelper } from 'src/helpers/error.utils';
import { DeepPartial } from 'typeorm';
import { MailPayload } from '../mail/dto/mail.dto';
import { MailService } from '../mail/mail.service';
import { CreateUserDto } from '../user/dto/user.dto';
import { UserService } from '../user/user.service';

import { AuthService } from './auth.service';
import { LoginDto, PhoneLoginDto, VerifyPayload } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly mailService: MailService,
  ) {}

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

  @Post('login/admin')
  async loginAdmin(@Body() payload: LoginDto, @Res() res: Response) {
    const { accessToken, refreshToken, expires } = await this.authService.loginAdmin(payload);
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

  @Post('verify')
  async verify(@Body() payload: VerifyPayload) {
    const { email, code } = payload;
    const user = await this.userService.findByEmail(email);

    if (!user) {
      return {
        message: USER_MESSAGE.USER_NOT_FOUND,
      };
    }

    const verify = await this.authService.verifyUserEmail(user.id, code);

    if (verify) {
      try {
        await this.userService.update(user.id, { isVerified: true });

        return {
          message: MAIL_MESSAGE.VERIFIED_EMAIL_SUCCESSFULLY,
        };
      } catch (err) {
        ErrorHelper.InternalServerErrorException(err);
      }
    }

    return {
      message: MAIL_MESSAGE.SEND_MAIL_FAILED,
    };
  }

  @Post('send-verify-email')
  @HttpCode(200)
  async sendVerifyEmail(@Body('email') email: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      return {
        message: USER_MESSAGE.USER_NOT_FOUND,
      };
    }

    return await this.authService.sendUserVerificationEmail(email);
  }

  @Post('send-otp')
  async sendOTP(@Body('phone') phone: string) {
    return await this.authService.sendOTP(phone);
  }

  @Post('verify-otp')
  async verifyOTP(@Body() payload: PhoneLoginDto) {
    return await this.authService.verifyOtp(payload);
  }

  @Post('login-otp')
  async loginOTP(@Body() payload: PhoneLoginDto, @Res() res: Response) {
    const { accessToken, refreshToken, expires } = await this.authService.loginWithOTP(payload);
    res.cookie('JWT', 'Bearer ' + accessToken, {
      maxAge: expires,
      httpOnly: true,
    });
    res.json({ accessToken, refreshToken });
    return {
      message: 'Login successfully',
      accessToken,
      refreshToken,
    };
  }
}
