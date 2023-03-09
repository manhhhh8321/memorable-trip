import { BaseModel } from 'src/base/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { Room } from './room.entity';

@Entity()
export class Description extends BaseModel {
  constructor(partial: Partial<Description>) {
    super();
    Object.assign(this, partial);
  }

  @Column({
    type: 'text',
    nullable: false,
    unique: true,
  })
  name: string;

  @OneToMany((types) => Room, (room) => room.description, { cascade: true })
  room: Array<Room>;
}
