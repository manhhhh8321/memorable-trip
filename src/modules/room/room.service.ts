import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import moment from 'moment';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { PROVINCES } from 'src/common/base.constant';
import {
  AMENITIES_MESSAGE,
  CITY_MESSAGE,
  DESCRIPTION_MESSAGE,
  ROOM_MESSAGE,
  USER_MESSAGE,
} from 'src/constants/message.constant';
import { BookingDate, Image, Room, RoomAmenities } from 'src/entities';
import { City } from 'src/entities/city.entity';
import { ErrorHelper } from 'src/helpers/error.utils';
import {
  Brackets,
  Equal,
  FindManyOptions,
  getConnection,
  getRepository,
  In,
  LessThan,
  LessThanOrEqual,
  MoreThan,
  Repository,
} from 'typeorm';
import { AmenitiesService } from '../amenities/amenities.service';
import { DescriptionService } from '../description/description.service';
import { UserService } from '../user/user.service';
import { GetListDto, RoomDto, UpdateRoomDto } from './dto/room.dto';
import { generateFakeRoomDto } from './faker/room.faker';
import { RoomsRepository } from './room.repository';
import { UserType } from 'src/enums/user.enum';
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
    @InjectRepository(BookingDate) private readonly bookingDateRepo: Repository<BookingDate>,
    @InjectRepository(Image) private readonly imageRepo: Repository<Image>,
  ) {}

  async seedCity() {
    const city = PROVINCES;

    for (const c of city) {
      const newCity = new City({ name: c.name, code: c.code });
      await this.cityRepo.save(newCity);
    }
  }

  async find(options?: FindManyOptions<Room>) {
    return await this.roomRepo.find(options);
  }

  async create(userId: number, payload: RoomDto) {
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

    await this.userService.update(userId, { userType: UserType.OWNER });
    image.forEach(async (i) => {
      const img = new Image({
        url: i,
        room: r,
      });

      await this.imageRepo.save(img);
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
      checkIn,
      checkOut,
    } = searchCriteria;

    const where: any = {};

    if (price) {
      where.price = LessThanOrEqual(price);
    }

    if (roomType) {
      where.roomType = roomType;
    }

    if (amenities) {
      const subquery = (await this.roomRepo.createQueryBuilder('room'))
        .innerJoin('room.roomAmenities', 'ras')
        .innerJoin('ras.amenities', 'amenities')
        .where('amenities.name IN (:...names)', { names: amenities })
        .select('room.id')
        .getQuery();

      const qb = (await this.roomRepo.createQueryBuilder('room'))
        .innerJoin('room.roomAmenities', 'ras')
        .innerJoin('ras.amenities', 'amenities')
        .where(`room.id IN (${subquery})`)
        .andWhere('amenities.name IN (:...names)', { names: amenities });

      const rooms = await qb.getMany();
      where.id = In(rooms.map((room) => room.id));
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
      const c = await this.cityRepo.findOne({ name: city });
      const qb = await this.roomRepo.createQueryBuilder('room');

      const subquery = await qb
        .innerJoin('room.city', 'city')
        .where('city.code = :code', { code: c.code })
        .select('room.id')
        .getMany();

      where.id = In(subquery.map((room) => room.id));
    }

    if (checkIn && checkOut) {
      const activeRooms = await this.roomRepo.find({
        where: { isActive: true },
      });

      const queryBuilder = getRepository(Room)
        .createQueryBuilder('room')
        .leftJoinAndSelect('room.bookingDate', 'bd')
        .where('room.isActive = :isActive', { isActive: true })
        .andWhere('bd."isAvailable" = :isAvailable', { isAvailable: true })
        .andWhere('bd."checkIn" >= :checkInDate', { checkInDate: checkIn })
        .andWhere('bd."checkOut" <= :checkOutDate', { checkOutDate: checkOut });

      const bookingDateRooms = await queryBuilder.getMany();
      const rooms = [...activeRooms, ...bookingDateRooms];

      where.id = In(rooms.map((room) => room.id));
    }

    return this.roomRepo.paginationRepository(this.roomEntityRepo, options, {
      where,
    });
  }

  async findById(id: number) {
    const room = await this.roomRepo.findOne({
      where: { id },
      relations: ['roomAmenities'],
    });

    if (!room) {
      ErrorHelper.BadRequestException(ROOM_MESSAGE.GET.NOT_FOUND);
    }

    return room;
  }

  async updateRoom(id: number, payload: UpdateRoomDto, ownerId?: number) {
    const room = await this.roomRepo.findOne({
      where: { id },
    });

    if (!room) {
      ErrorHelper.BadRequestException(ROOM_MESSAGE.GET.NOT_FOUND);
    }

    if (ownerId && room.user.id !== ownerId) {
      ErrorHelper.BadRequestException(ROOM_MESSAGE.GET.NOT_OWNER);
    }

    const updatedRoom = Object.assign(room, payload);

    if (payload.amenities.length > 0) {
      const aments = await this.amenitiesService.findByNames(payload.amenities);

      // Update amenities
      await this.roomAmenitiesRepo.delete({ roomId: id });

      aments.map(async (a) => {
        const roomAmenities = new RoomAmenities();
        const amenities = await this.amenitiesService.findByName(a.name);
        roomAmenities.amenitiesId = amenities.id;
        roomAmenities.roomId = id;

        await this.roomAmenitiesRepo.save(roomAmenities);
      });
    }

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

    return this.roomRepo.softDeleteItem({
      id,
    });
  }

  async findAvailableRooms(
    checkIn: string | Date,
    checkOut: string | Date,
    city?: string,
    page?: number,
    limit?: number,
  ) {
    const activeRooms = await this.roomRepo.find({
      where: { isActive: true },
    });

    const queryBuilder = getRepository(Room)
      .createQueryBuilder('room')
      .leftJoinAndSelect('room.city', 'city')
      .leftJoinAndSelect('room.bookingDate', 'bd')
      .where('room.isActive = :isActive', { isActive: true })
      .andWhere('bd."isAvailable" = :isAvailable', { isAvailable: true })
      .andWhere('bd."checkIn" >= :checkInDate', { checkInDate: checkIn })
      .andWhere('bd."checkOut" <= :checkOutDate', { checkOutDate: checkOut });

    if (city) {
      queryBuilder.andWhere('city.name LIKE :cityName', { cityName: `%${city}%` });
    }

    const bookingDateRooms = await queryBuilder.getMany();
    const rooms = [...activeRooms, ...bookingDateRooms];

    return await this.roomRepo.paginationRepository(
      this.roomEntityRepo,
      { limit, page },
      {
        where: { id: In(rooms.map((room) => room.id)) },
      },
    );
  }

  async getRoomByUserId(userId: number) {
    const rooms = await this.roomRepo.find({
      where: { user: { id: userId } },
      relations: ['roomAmenities'],
    });

    return rooms;
  }

  async getRoomUnavailableDate(id: number) {
    const bookingDate = await this.bookingDateRepo.find({
      where: { room: { id } },
      relations: ['room'],
    });

    const unavailableDates = [];

    bookingDate.forEach((bd) => {
      const dates = `${bd.checkIn} - ${bd.checkOut}`;
      unavailableDates.push(dates);
    });

    return unavailableDates;
  }
}
