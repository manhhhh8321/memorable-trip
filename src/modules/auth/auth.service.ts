import { Injectable } from '@nestjs/common';
import { EncryptHelper } from 'src/helpers/encrypt.helper';
import { ErrorHelper } from 'src/helpers/error.utils';
import { TokenHelper } from 'src/helpers/token.helper';
import { ConfigService } from 'src/shared/config/config.service';

import { UserService } from '../user/user.service';

import { LoginDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(private userService: UserService, private configService: ConfigService) {}

  async login(params: LoginDto) {
    const { email, password } = params;
    const user = await this.userService.findByEmail(email);
    if (!(await EncryptHelper.compare(password, user.password))) {
      ErrorHelper.BadRequestException('Wrong credentials');
    }
    return this._generateToken(user.id.toString());
  }

  async verifyUser(id: string) {
    return this.userService.findById(id);
  }

  private _generateToken(id: string) {
    const payload = {
      id,
    };
    const secret = this.configService.accessTokenSecret;
    const expiresIn = this.configService.accessTokenExpires;
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
}
