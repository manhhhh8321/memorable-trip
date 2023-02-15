import { BaseModel } from 'src/base/base.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class Agent extends BaseModel {
  constructor(partial: Partial<Agent>) {
    super();
    Object.assign(this, partial);
  }

  @Column({
    type: 'text',
    length: 512,
  })
  propertyName: string;

  @Column({
    type: 'tinyint',
    nullable: true,
  })
  rating: number;

  @Column({
    type: 'text',
    length: 1024,
    nullable: true,
  })
  description: string;

  @Column({
    type: 'text',
    nullable: false,
  })
  addressLine: string;
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
}
