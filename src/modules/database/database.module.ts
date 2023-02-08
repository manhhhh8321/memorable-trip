import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import {
  DATABASE_HOST,
  DATABASE_TYPE,
  POSTGRES_DATABASE,
  POSTGRES_PORT,
  POSTGRES_PASSWORD,
  POSTGRES_USER,
} from 'src/environments';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (): TypeOrmModuleOptions => {
        return {
          type: DATABASE_TYPE as any,
          host: DATABASE_HOST,
          port: POSTGRES_PORT,
          username: POSTGRES_USER,
          password: POSTGRES_PASSWORD,
          database: POSTGRES_DATABASE,
          // try autoload entities
          autoLoadEntities: true,
          entities: ['src/**/*.entity.{ts,js}'],
          // use cli and run schema:sync is better for secured data
          synchronize: true,
          // cache
          // cache: {
          //   type: CACHE_TYPE as any,
          //   options: {
          //     host: CACHE_HOST,
          //     port: CACHE_PORT,
          //   },
          //   ignoreErrors: true,
          // },
          //logging
          logging: ['query', 'error'],
          logger: 'file',
        };
      },
    }),
  ],
})
export class DatabaseModule {}
