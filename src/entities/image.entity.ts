import { BaseModel } from 'src/base/base.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Room } from './room.entity';

@Entity()
export class Image extends BaseModel {
  constructor(partial: Partial<Image>) {
    super();
    Object.assign(this, partial);
  }

  @Column('text')
  url: string;

  @ManyToOne((type) => Room, (room) => room.image)
  room: Room;
}
