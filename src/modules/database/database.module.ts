import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'postgres',
          host: configService.get<string>('POSTGRES_HOSTNAME'),
          port: configService.get<number>('POSTGRES_PORT'),
          username: configService.get<string>('POSTGRES_USERNAME'),
          password: configService.get<string>('POSTGRES_PASSWORD'),
          database: configService.get<string>('POSTGRES_DB'),
          // entities: [__dirname + '/../modules/**entities/*.entity{.ts,.js}'],
          entities: [__dirname + '/../../entities/*.entity{.ts,.js}'],
          synchronize: true,
          // ssl:
          //   configService.get<string>('NODE_ENV') != 'local'
          //     ? {
          //         rejectUnauthorized: false,
          //       }
          //     : false,
          ssl: false,
          keepConnectionAlive: true,
        };
      },
    }),
  ],
})
export class DatabaseModule {}
