import { Global, Module } from '@nestjs/common';

import { UserModule } from '../user/user.module';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MailModule } from '../mail/mail.module';
import { RedisModuleCache } from '../redis/redis.module';
@Global()
@Module({
  imports: [UserModule, MailModule, RedisModuleCache],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
