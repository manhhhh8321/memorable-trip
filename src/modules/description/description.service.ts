import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DESCRIPTION } from 'src/common/base.constant';
import { Description } from 'src/entities';
import { Repository } from 'typeorm';

@Injectable()
export class DescriptionService {
  constructor(@InjectRepository(Description) private readonly descriptionRepo: Repository<Description>) {}

  async seedDescription() {
    const description = DESCRIPTION;

    for (let d of description) {
      await this.descriptionRepo.create({ name: d });
    }

    return 'Seed description success';
  }

  async findByName(name: string) {
    return await this.descriptionRepo.findOne({ name });
  }
}
