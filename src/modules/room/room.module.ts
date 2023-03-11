import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from 'src/entities';
import { DescriptionModule } from '../description/description.module';
import { RoomController } from './room.controller';
import { RoomsRepository } from './room.repository';
import { RoomService } from './room.service';

@Module({
  imports: [TypeOrmModule.forFeature([Room]), DescriptionModule],
  controllers: [RoomController],
  providers: [RoomService, RoomsRepository],
  exports: [RoomService, TypeOrmModule],
})
export class RoomModule {}
