import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import {
  DATABASE_HOST,
  DATABASE_TYPE,
  MYSQL_DATABASE,
  MYSQL_PORT,
  MYSQL_PASSWORD,
  MYSQL_USER,
  CACHE_TYPE,
  CACHE_HOST,
  CACHE_PORT,
} from 'src/environments';

import { User } from '../users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (): TypeOrmModuleOptions => {
        return {
          type: DATABASE_TYPE as any,
          host: DATABASE_HOST,
          port: MYSQL_PORT,
          username: MYSQL_USER,
          password: MYSQL_PASSWORD,
          database: MYSQL_DATABASE,
          // try autoload entities
          autoLoadEntities: true,
          entities: [User],
          // use cli and run schema:sync is better for secured data
          synchronize: false,
          // cache
          cache: {
            type: CACHE_TYPE as any,
            options: {
              host: CACHE_HOST,
              port: CACHE_PORT,
            },
            ignoreErrors: true,
          },
          //logging
          logging: ['query', 'error'],
          logger: 'file',
        };
      },
    }),
  ],
})
export class DatabaseModule {}
