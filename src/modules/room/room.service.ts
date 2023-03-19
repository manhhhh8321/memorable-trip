import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PROVINCES } from 'src/common/base.constant';
import { AMENITIES_MESSAGE, CITY_MESSAGE, DESCRIPTION_MESSAGE, USER_MESSAGE } from 'src/constants/message.constant';
import { Room, RoomAmenities } from 'src/entities';
import { City } from 'src/entities/city.entity';
import { ErrorHelper } from 'src/helpers/error.utils';
import { Repository } from 'typeorm';
import { AmenitiesService } from '../amenities/amenities.service';
import { DescriptionService } from '../description/description.service';
import { UserService } from '../user/user.service';
import { RoomDto } from './dto/room.dto';
import { generateFakeRoomDto } from './faker/room.faker';
import { RoomsRepository } from './room.repository';
@Injectable()
export class RoomService {
  constructor(
    private readonly roomRepo: RoomsRepository,
    @InjectRepository(City) private readonly cityRepo: Repository<City>,
    private readonly amenitiesService: AmenitiesService,
    private readonly descriptionService: DescriptionService,
    private userService: UserService,
    @InjectRepository(RoomAmenities) private readonly roomAmenitiesRepo: Repository<RoomAmenities>,
  ) {}

  async seedCity() {
    const city = PROVINCES;

    for (const c of city) {
      const newCity = new City({ name: c.name, code: c.code });
      await this.cityRepo.save(newCity);
    }
  }

  async create(payload: RoomDto) {
    const {
      amenities,
      description,
      city,
      numberOfBathroom,
      numberOfBed,
      numberOfBedroom,
      numberOfLivingRoom,
      price,
      roomName,
      roomType,
      about,
      address,
      userId,
      image,
    } = payload;

    const user = await this.userService.findById(userId);

    if (!user) {
      ErrorHelper.BadRequestException(USER_MESSAGE.USER_NOT_FOUND);
    }

    const des = await this.descriptionService.findByName(description);

    if (!des) {
      ErrorHelper.BadRequestException(DESCRIPTION_MESSAGE.GET.NOT_FOUND);
    }

    const cty = await this.cityRepo.findOne({ name: city });

    if (!cty) {
      ErrorHelper.BadRequestException(CITY_MESSAGE.GET.NOT_FOUND);
    }

    const aments = await this.amenitiesService.findByNames(amenities);

    // Throw an error if any of the amenities are not found
    if (amenities.length !== amenities.length) {
      const missingAmenities = amenities.filter((name) => !aments.find((a) => a.name === name));
      throw new Error(`Amenities with names ${missingAmenities.join(', ')} not found`);
    }

    const room = new Room({
      description: des,
      city: cty,
      numberOfBathroom,
      numberOfBed,
      numberOfBedroom,
      numberOfLivingRoom,
      price,
      roomName,
      roomType,
      about,
      address,
    });

    room.user = user;

    const r = await this.roomRepo.create(room);

    aments.map(async (a) => {
      const roomAmenities = new RoomAmenities();
      const amenities = await this.amenitiesService.findByName(a.name);
      roomAmenities.amenitiesId = amenities.id;
      roomAmenities.roomId = r.id;

      await this.roomAmenitiesRepo.save(roomAmenities);
    });

    return r;
  }

  // async seedRoom() {
  //   for (let i = 0; i < 500; i++) {
  //     const r = generateFakeRoomDto();

  //     await this.create(r);
  //   }
  // }
}
