import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { PROVINCES } from 'src/common/base.constant';
import {
  AMENITIES_MESSAGE,
  CITY_MESSAGE,
  DESCRIPTION_MESSAGE,
  ROOM_MESSAGE,
  USER_MESSAGE,
} from 'src/constants/message.constant';
import { Room, RoomAmenities } from 'src/entities';
import { City } from 'src/entities/city.entity';
import { ErrorHelper } from 'src/helpers/error.utils';
import { Brackets, FindConditions, LessThan, LessThanOrEqual, Repository } from 'typeorm';
import { AmenitiesService } from '../amenities/amenities.service';
import { DescriptionService } from '../description/description.service';
import { UserService } from '../user/user.service';
import { GetListDto, RoomDto, UpdateRoomDto } from './dto/room.dto';
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
    @InjectRepository(Room) private readonly roomEntityRepo: Repository<Room>,
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

  async getAll(options: IPaginationOptions, searchCriteria?: GetListDto) {
    const {
      price,
      roomType,
      amenities,
      description,
      numberOfBathroom,
      numberOfBed,
      numberOfBedroom,
      numberOfLivingRoom,
      city,
    } = searchCriteria;

    const where: any = { isAvailable: true };

    if (price) {
      where.price = price;
    }

    if (roomType) {
      where.roomType = roomType;
    }

    if (amenities) {
      const amenityIds = await (
        await this.roomRepo.createQueryBuilder('amenity')
      )
        .where('amenity.name IN (:...names)', { names: amenities })
        .getMany()
        .then((amenities) => amenities.map((amenity) => amenity.id));
      where.amenities = { id: amenityIds };
    }

    if (description) {
      where.description = { id: description };
    }

    if (numberOfBathroom) {
      where.numberOfBathroom = numberOfBathroom;
    }

    if (numberOfBed) {
      where.numberOfBed = numberOfBed;
    }

    if (numberOfBedroom) {
      where.numberOfBedroom = numberOfBedroom;
    }

    if (numberOfLivingRoom) {
      where.numberOfLivingRoom = numberOfLivingRoom;
    }

    if (city) {
      where.city = { id: city };
    }

    const rooms = await this.roomRepo.find({
      where,
      relations: ['amenities', 'description', 'city'],
    });

    return rooms;
  }

  async findById(id: number) {
    const room = await this.roomRepo.findOne({
      where: { id },
    });

    if (!room) {
      ErrorHelper.BadRequestException(ROOM_MESSAGE.GET.NOT_FOUND);
    }

    return room;
  }

  async updateRoom(id: number, payload: UpdateRoomDto, ownerId?: number) {
    const { ...rest } = payload;

    const room = await this.roomRepo.findOne({
      where: { id },
    });

    if (!room) {
      ErrorHelper.BadRequestException(AMENITIES_MESSAGE.GET.NOT_FOUND);
    }

    if (ownerId && room.user.id !== ownerId) {
      ErrorHelper.BadRequestException(ROOM_MESSAGE.GET.NOT_OWNER);
    }

    const updatedRoom = Object.assign(room, rest);

    return this.roomRepo.updateItem(updatedRoom);
  }

  async deleteRoom(id: number, ownerId?: number) {
    const room = await this.roomRepo.findOne({
      where: { id },
    });

    if (!room) {
      ErrorHelper.BadRequestException(AMENITIES_MESSAGE.GET.NOT_FOUND);
    }

    if (ownerId && room.user.id !== ownerId) {
      ErrorHelper.BadRequestException(ROOM_MESSAGE.GET.NOT_OWNER);
    }

    return this.roomRepo.removeItem(room);
  }
}
