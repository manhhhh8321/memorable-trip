import { BaseModel } from 'src/base/base.entity';
import { Room } from 'src/entities/index';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Owner extends BaseModel {
  constructor(partial: Partial<Owner>) {
    super();
    Object.assign(this, partial);
  }

  @Column({
    type: 'int',
    nullable: true,
  })
  rating: number;

  @Column({
    type: 'text',
    nullable: true,
  })
  description: string;

  @Column({
    type: 'text',
    nullable: false,
  })
  addressLine: string;

  @OneToMany((types) => Room, (room) => room.owner, { cascade: true })
  room: Array<Room>;
}

@Entity()
export class City extends BaseModel {
  constructor(partial: Partial<City>) {
    super();
    Object.assign(this, partial);
  }

  @Column('text')
  cityName: string;

  @Column('text')
  postCode: string;

  @OneToMany((types) => Room, (room) => room.city, { cascade: true })
  room: Array<Room>;
}
