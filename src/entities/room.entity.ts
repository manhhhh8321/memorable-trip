import { BaseModel } from 'src/base/base.entity';
import { RoomType } from 'src/enums/user.enum';
import { City } from 'src/entities/city.entity';
import { RoomAmenities } from 'src/entities/amenities.entity';
import { Discount, RoomDiscount, Image, Description, User } from 'src/entities/index';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class Room extends BaseModel {
  constructor(partial: Partial<Room>) {
    super();
    Object.assign(this, partial);
  }

  @Column({
    type: 'enum',
    enum: ['ROOM', 'ENTIRE_HOME', 'SHARED_ROOM'],
    enumName: 'room_type',
  })
  roomType: RoomType;

  @Column('text')
  roomName: string;

  @Column({
    type: 'boolean',
    nullable: true,
    default: true,
  })
  isAvailable: boolean;

  @Column('float', { nullable: false, default: 0 })
  price: number;

  @Column('text')
  about: string;

  @Column('int')
  numberOfLivingRoom: number;

  @Column('int')
  numberOfBedroom: number;

  @Column('int')
  numberOfBed: number;

  @Column('int')
  numberOfBathroom: number;

  @Column('text')
  address: string;

  @OneToMany((types) => RoomDiscount, (roomDiscount) => roomDiscount.room, { cascade: true })
  discount: RoomDiscount[];

  @OneToMany((type) => RoomAmenities, (roomAmenities) => roomAmenities.amenities, { cascade: true })
  amenities: RoomAmenities[];

  @OneToMany((type) => Image, (image) => image.room, { cascade: true })
  image: Image[];

  @ManyToOne((type) => City, (city) => city.room)
  city: City;

  @ManyToOne((type) => Description, (description) => description.room)
  description: Description;

  @ManyToOne((type) => User, (user) => user.room)
  @JoinColumn({ name: 'ownerId' })
  user: User;
}
