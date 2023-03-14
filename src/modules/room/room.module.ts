import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from 'src/entities';
import { City } from 'src/entities/city.entity';
import { DescriptionModule } from '../description/description.module';
import { RoomController } from './room.controller';
import { RoomsRepository } from './room.repository';
import { RoomService } from './room.service';

@Module({
  imports: [TypeOrmModule.forFeature([Room, City]), DescriptionModule],
  controllers: [RoomController],
  providers: [RoomService, RoomsRepository],
  exports: [RoomService, TypeOrmModule],
})
export class RoomModule {}
