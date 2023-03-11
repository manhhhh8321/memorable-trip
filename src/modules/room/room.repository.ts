import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from 'src/base/base.repository';
import { Room } from 'src/entities';
import { EntityRepository, Repository } from 'typeorm';

@Injectable()
export class RoomsRepository extends BaseRepository<Room> {
  constructor(@InjectRepository(Room) private readonly roomRepo: Repository<Room>) {
    super(roomRepo);
  }
}
