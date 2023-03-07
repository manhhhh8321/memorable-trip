import { BaseModel } from 'src/base/base.entity';
import { RoomType } from 'src/enums/user.enum';
import { Agent } from 'src/entities/agent.entity';
import { RoomAmenities } from 'src/entities/amenities.entity';
import { Discount, RoomDiscount, Image } from 'src/entities/index';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class Room extends BaseModel {
  constructor(partial: Partial<Room>) {
    super();
    Object.assign(this, partial);
  }

  @Column({
    type: 'enum',
    enum: RoomType,
  })
  roomType: RoomType;

  @Column('text')
  roomName: string;

  @Column({
    type: 'boolean',
    nullable: true,
  })
  isAvailable: boolean;

  @Column({
    type: 'numeric',
    nullable: true,
  })
  roomSize: number;

  @Column('numeric')
  price: number;

  @ManyToOne((types) => Agent, (agent) => agent.room)
  agent: Agent;

  @OneToMany((types) => RoomDiscount, (roomDiscount) => roomDiscount.room, { cascade: true })
  roomDiscount: RoomDiscount[];

  @OneToMany((type) => RoomAmenities, (roomAmenities) => roomAmenities.amenities, { cascade: true })
  roomAmenities: RoomAmenities[];

  @OneToMany((type) => Image, (image) => image.room, { cascade: true })
  image: Image[];
}
