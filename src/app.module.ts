import { Module } from '@nestjs/common';

import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from './shared/config/config.module';
import { DatabaseModule } from './modules/database/database.module';

@Module({
  imports: [AuthModule, ConfigModule, DatabaseModule],
})
export class AppModule {}
