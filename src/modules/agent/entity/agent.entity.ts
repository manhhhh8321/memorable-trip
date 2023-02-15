import { BaseModel } from 'src/base/base.entity';
import { Room } from 'src/modules/room/entity/room.entity';
import { User } from 'src/modules/user/entity/user.entity';
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
export class Agent extends BaseModel {
  constructor(partial: Partial<Agent>) {
    super();
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn('increment')
  id: number;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
  })
  updatedAt: Date;

  @Column({
    type: 'text',
  })
  propertyName: string;

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

  @ManyToOne((types) => City, (city) => city.agent)
  city: Relation<City>;

  @OneToMany((types) => Room, (room) => room.agent, { cascade: true })
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

  @OneToMany((types) => Agent, (agent) => agent.city, { cascade: true })
  agent: Array<Agent>;
}
