import { BaseModel } from 'src/base/base.entity';
import { RoomType } from 'src/enums/user.enum';
import { City } from 'src/entities/city.entity';
import { Amenities, RoomAmenities } from 'src/entities/amenities.entity';
import { Discount, RoomDiscount, Image, Description, User, Booking, BookingDate } from 'src/entities/index';
import { Column, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';

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

  @Column({
    type: 'boolean',
    default: true,
  })
  isActive: boolean;

  @DeleteDateColumn({
    type: 'timestamp',
    nullable: true,
    name: 'deleted_at',
  })
  deletedAt: Date;

  @OneToMany((types) => RoomDiscount, (roomDiscount) => roomDiscount.room, { cascade: true })
  discount: RoomDiscount[];

  @OneToMany(() => RoomAmenities, (roomAmenities) => roomAmenities.room, { cascade: true })
  roomAmenities: RoomAmenities[];

  @OneToMany((type) => Image, (image) => image.room, { cascade: true, eager: true })
  image: Image[];

  @ManyToOne((type) => City, (city) => city.room, { eager: true })
  city: City;

  @ManyToOne((type) => Description, (description) => description.room, { eager: true })
  description: Description;

  @ManyToOne((type) => User, (user) => user.room, { eager: true })
  @JoinColumn({ name: 'ownerId' })
  user: User;

  @OneToMany((types) => BookingDate, (bookingDate) => bookingDate.room, { cascade: true, eager: true })
  bookingDate: BookingDate[];
}
