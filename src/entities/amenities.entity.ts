import { BaseModel } from 'src/base/base.entity';
import { Room } from 'src/entities/index';

import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';

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

  @Column({
    type: 'text',
    nullable: true,
    unique: true,
  })
  icon: string;

  @OneToMany(() => RoomAmenities, (roomAmenities) => roomAmenities.amenities)
  roomAmenities: Room[];
}

@Entity()
export class RoomAmenities {
  @PrimaryColumn()
  roomId: number;

  @PrimaryColumn()
  amenitiesId: number;

  @ManyToOne((type) => Room, (room) => room.roomAmenities)
  room: Room;

  @ManyToOne((type) => Amenities, (amenities) => amenities.roomAmenities, { eager: true })
  amenities: Amenities;
}
