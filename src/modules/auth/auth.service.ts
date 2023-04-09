import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { MAIL_MESSAGE, USER_MESSAGE } from 'src/constants/message.constant';
import { EncryptHelper } from 'src/helpers/encrypt.helper';
import { ErrorHelper } from 'src/helpers/error.utils';
import { TokenHelper } from 'src/helpers/token.helper';
import { ConfigService } from 'src/shared/config/config.service';
import { RedisService } from '../redis/redis.service';
import { MailerService } from '@nestjs-modules/mailer';

import { UserService } from '../user/user.service';

import { LoginDto, PhoneLoginDto } from './dto/auth.dto';
import { MailPayload } from '../mail/dto/mail.dto';

import * as dotenv from 'dotenv';
dotenv.config();

import twilio = require('twilio');
import { UserType } from 'src/enums/user.enum';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
let client = null;
if (accountSid || authToken) {
  client = twilio(accountSid, authToken);
}

const GLOBAL_SERVICE = process.env.TWILIO_SERVICE_SID;

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private configService: ConfigService,
    private readonly redisService: RedisService,
    private readonly mailService: MailerService,
  ) {}

  async login(params: LoginDto) {
    const { email, password } = params;
    const user = await this.userService.findByEmail(email);

    if (!user) {
      ErrorHelper.BadRequestException(USER_MESSAGE.USER_NOT_FOUND);
    }

    if (!(await EncryptHelper.compare(password, user.password))) {
      ErrorHelper.BadRequestException('Wrong credentials');
    }
    return this._generateToken(user.id.toString());
  }

  async loginAdmin(params: LoginDto) {
    const { email, password } = params;
    const user = await this.userService.findByEmail(email);

    if (!user || user.userType !== UserType.ADMIN) {
      ErrorHelper.BadRequestException(USER_MESSAGE.USER_NOT_FOUND);
    }

    if (!(await EncryptHelper.compare(password, user.password))) {
      ErrorHelper.BadRequestException('Wrong credentials');
    }
    return this._generateToken(user.id.toString());
  }

  async verifyUser(id: number) {
    return this.userService.findById(id);
  }

  private _generateToken(id: string) {
    const payload = {
      id,
    };
    const secret = this.configService.accessTokenSecret;
    const expiresIn = this.configService.accessTokenExpireMinutes;
    const { token: accessToken, expires } = TokenHelper.generate(payload, secret, expiresIn);
    const refreshToken = this._generateRefreshToken(id);

    return {
      accessToken,
      expires,
      refreshToken,
    };
  }

  private _generateRefreshToken(id: string) {
    return `refresh-token-${id}`;
  }

  async sendUserVerificationEmail(email: string) {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      ErrorHelper.BadRequestException(USER_MESSAGE.USER_NOT_FOUND);
    }

    const randNumber = Math.floor(Math.random() * 1000000);

    const p = {
      id: user.id,
      randNumber,
    };

    try {
      await this.redisService.set(user.id.toString(), JSON.stringify(p), 120);
      await this.mailService.sendMail({
        to: email,
        subject: 'Verify your email',
        template: 'verify-email',
        context: {
          code: randNumber,
          mail: email,
        },
      });
    } catch (err) {
      ErrorHelper.BadRequestException(JSON.stringify(err));
    }

    return {
      randNumber,
      message: 'Verification code sent to your email',
    };
  }

  async verifyUserEmail(id: number, randNumber: number) {
    const redisData = await this.redisService.get(id.toString());

    if (!redisData) {
      ErrorHelper.BadRequestException(MAIL_MESSAGE.VERIFICATION_CODE_EXPIRED);
      return false;
    }

    const data = JSON.parse(redisData);

    if (data.id !== id || data.randNumber !== randNumber) {
      ErrorHelper.BadRequestException('Verification code not match');
      return false;
    }

    return true;
  }

  // Twilio auth
  async sendOTP(phoneNumber: string) {
    const user = await this.userService.findByPhone(phoneNumber);

    if (!user) {
      ErrorHelper.BadRequestException(USER_MESSAGE.USER_NOT_FOUND);
    }

    try {
      await client.verify.v2.services(GLOBAL_SERVICE).verifications.create({ to: phoneNumber, channel: 'sms' });
    } catch (err) {
      ErrorHelper.BadRequestException(err.message);
    }

    return {
      message: 'Verification code sent to your phone number',
    };
  }

  async loginWithOTP(phoneLoginDto: PhoneLoginDto) {
    const { phone, code } = phoneLoginDto;
    try {
      const verifyOTP = await client.verify.v2
        .services(GLOBAL_SERVICE)
        .verificationChecks.create({ to: phone, code: code });

      if (verifyOTP.status !== 'approved') {
        ErrorHelper.BadRequestException('Wrong credentials');
      }
    } catch (err) {
      ErrorHelper.BadRequestException(err);
    }

    const user = await this.userService.findByPhone(phone);

    if (!user) {
      ErrorHelper.BadRequestException(USER_MESSAGE.USER_NOT_FOUND);
    }

    return this._generateToken(user.id.toString());
  }
}
