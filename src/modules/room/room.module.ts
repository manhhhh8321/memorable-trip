import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Amenities, BookingDate, Image, Room, RoomAmenities } from 'src/entities';
import { City } from 'src/entities/city.entity';
import { AmenitiesModule } from '../amenities/amenities.module';
import { DescriptionModule } from '../description/description.module';
import { UserModule } from '../user/user.module';
import { RoomController } from './room.controller';
import { RoomsRepository } from './room.repository';
import { RoomService } from './room.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Room, City, RoomAmenities, Amenities, BookingDate, Image]),
    DescriptionModule,
    AmenitiesModule,
    UserModule,
  ],
  controllers: [RoomController],
  providers: [RoomService, RoomsRepository],
  exports: [RoomService, TypeOrmModule],
})
export class RoomModule {}
