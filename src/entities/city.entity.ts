import { BaseModel } from 'src/base/base.entity';
import { Room } from 'src/entities/index';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity()
export class City extends BaseModel {
  constructor(partial: Partial<City>) {
    super();
    Object.assign(this, partial);
  }

  @Column({
    type: 'text',
    nullable: true,
  })
  name: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  code: string;

  @OneToMany((types) => Room, (room) => room.city, { cascade: true })
  room: Array<Room>;
}
