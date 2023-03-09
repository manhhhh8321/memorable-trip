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

  @OneToMany((types) => RoomDiscount, (roomDiscount) => roomDiscount.room, { cascade: true })
  roomDiscount: RoomDiscount[];

  @OneToMany((type) => RoomAmenities, (roomAmenities) => roomAmenities.amenities, { cascade: true })
  roomAmenities: RoomAmenities[];

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
