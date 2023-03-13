import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from 'src/base/base.repository';
import { AMENITIES } from 'src/common/base.constant';
import { Amenities } from 'src/entities';
import { ErrorHelper } from 'src/helpers/error.utils';
import { DeepPartial, Repository } from 'typeorm';

@Injectable()
export class AmenitiesService {
  constructor(@InjectRepository(Amenities) private readonly amenitiesRepo: Repository<Amenities>) {}

  async seedAmenities() {
    const amenities = AMENITIES;
    const icon = [
      '<i class="fa-solid fa-wifi"></i>',
      '<i class="fa-solid fa-tv"></i>',
      '<i class="fa-solid fa-air-conditioner"></i>',
      '<i class="fa-solid fa-bath"></i>',
      '<i class="fa-solid fa-bed"></i>',
      '<i class="fa-solid fa-parking"></i>',
      '<i class="fas-solid fa-swimming-pool"></i>',
      '<i class="fa-solid fa-smoking-ban"></i>',
      '<i class="fa-solid fa-wheelchair"></i>',
      '<i class="fa-solid fa-baby-carriage"></i>',
      '<i class="fa-solid fa-umbrella-beach"></i>',
      '<i class="fa-solid fa-snowflake"></i>',
      '<i class="fa-solid fa-fire"></i>',
      '<i class="fa-solid fa-bicycle"></i>',
    ];

    amenities.forEach((item) => {
      const amenity = new Amenities({
        name: item,
        icon: icon[amenities.indexOf(item)],
        rate: Math.floor(Math.random() * 10),
      });
      this.amenitiesRepo.create(amenity);
    });

    return 'Amenities seeded successfully';
  }

  async getAllAmenities() {
    return await this.amenitiesRepo.find();
  }

  async getAmenitiesById(id: number) {
    return await this.amenitiesRepo.findOne({
      where: {
        id,
      },
    });
  }

  async createAmenities(payload: DeepPartial<Amenities>) {
    const amenity = this.amenitiesRepo.create({ ...payload });

    return await this.amenitiesRepo.save(amenity);
  }

  async updateAmenities(id: number, payload: DeepPartial<Amenities>) {
    const amenity = await this.amenitiesRepo.findOne(id);

    if (!amenity) {
      throw ErrorHelper.BadRequestException('Amenity not found');
    }

    await this.amenitiesRepo.update(id, { ...payload });

    return await this.amenitiesRepo.findOne(id);
  }

  async deleteAmenities(id: number) {
    const amenity = await this.amenitiesRepo.findOne({
      where: {
        id,
      },
    });

    if (!amenity) {
      throw ErrorHelper.BadRequestException('Amenity not found');
    }

    await this.amenitiesRepo.remove(amenity);

    return 'Amenity deleted successfully';
  }
}
