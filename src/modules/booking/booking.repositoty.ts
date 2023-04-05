import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from 'src/base/base.repository';
import { Booking } from 'src/entities';
import { EntityRepository, Repository } from 'typeorm';

@Injectable()
export class BookingsRepository extends BaseRepository<Booking> {
  constructor(@InjectRepository(Booking) private readonly bookingRepo: Repository<Booking>) {
    super(bookingRepo);
  }
}
