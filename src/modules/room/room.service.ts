import { Injectable } from '@nestjs/common';
import { RoomsRepository } from './room.repository';
@Injectable()
export class RoomService {
  constructor(private readonly roomRepo: RoomsRepository) {}
}
