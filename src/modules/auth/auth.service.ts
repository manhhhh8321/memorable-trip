import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { MAIL_MESSAGE, USER_MESSAGE } from 'src/constants/message.constant';
import { EncryptHelper } from 'src/helpers/encrypt.helper';
import { ErrorHelper } from 'src/helpers/error.utils';
import { TokenHelper } from 'src/helpers/token.helper';
import { ConfigService } from 'src/shared/config/config.service';
import { RedisService } from '../redis/redis.service';
import { MailService } from '../mail/mail.service';

import { UserService } from '../user/user.service';

import { LoginDto } from './dto/auth.dto';
import { MailPayload } from '../mail/dto/mail.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private configService: ConfigService,
    private readonly redisService: RedisService,
    private readonly mailService: MailService,
  ) {}

  async login(params: LoginDto) {
    const { email, password } = params;
    const user = await this.userService.findByEmail(email);
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
        content: `Your verification code is ${randNumber}`,
        subject: 'Verification code',
        email: email,
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
}
