import { BaseModel } from 'src/base/base.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class Amenities extends BaseModel {
  constructor(partial: Partial<Amenities>) {
    super();
    Object.assign(this, partial);
  }

  @Column({
    type: 'text',
    nullable: false,
  })
  name: string;

  @Column({
    type: 'int',
    nullable: true,
  })
  rate: number;
}
