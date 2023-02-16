import { Injectable, Logger } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

@Injectable()
export class ConfigService {
  private logger = new Logger(ConfigService.name);
  constructor(private configService: NestConfigService) {}

  get baseUrlPrefix(): string {
    return this.configService.get('app.baseUrlPrefix');
  }

  get accessTokenSecret(): string {
    return this.configService.get('accessToken.secret');
  }

  get accessTokenExpireMinutes(): string {
    return this.configService.get<string>('JWT_ACCESS_EXPIRATION_MINUTES');
  }

  get refreshAccessTokenExpireDays(): string {
    return this.configService.get<string>('JWT_REFRESH_EXPIRATION_DAYS');
  }

  get accessTokenRememberMe(): string {
    return this.configService.get('accessToken.rememberMeIn');
  }

  get temporaryTokenSecret(): string {
    return this.configService.get('temporaryToken.secret');
  }

  get temporaryTokenExpires(): string {
    return this.configService.get('temporaryToken.expiresIn');
  }

  get verifyEmailExpirationMinutes(): string {
    return this.configService.get<string>('JWT_VERIFY_EMAIL_EXPIRATION_MINUTES');
  }

  get resetPasswordExpirationMinutes(): string {
    return this.configService.get('email.expiresIn');
  }
}
