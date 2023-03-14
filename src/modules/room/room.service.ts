import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PROVINCES } from 'src/common/base.constant';
import { City } from 'src/entities/city.entity';
import { Repository } from 'typeorm';
import { RoomsRepository } from './room.repository';
@Injectable()
export class RoomService {
  constructor(
    private readonly roomRepo: RoomsRepository,
    @InjectRepository(City) private readonly cityRepo: Repository<City>,
  ) {}

  async seedCity() {
    const city = PROVINCES;

    for (const c of city) {
      const newCity = new City({ name: c.name, code: c.code });
      await this.cityRepo.save(newCity);
    }
  }
}
