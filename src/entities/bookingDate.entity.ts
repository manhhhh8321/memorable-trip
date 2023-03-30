import { BaseModel } from 'src/base/base.entity';
import { BaseEntity, Column, Entity, ManyToOne } from 'typeorm';
import { Booking } from './booking.entity';
import { Room } from './room.entity';

@Entity()
export class BookingDate extends BaseModel {
  constructor(partial: Partial<BookingDate>) {
    super();
    Object.assign(this, partial);
  }

  @Column({
    type: 'date',
    nullable: false,
  })
  checkIn: Date;

  @Column({
    type: 'date',
    nullable: false,
  })
  checkOut: Date;

  @Column({
    type: 'boolean',
    nullable: false,
    default: false,
  })
  isAvailable: boolean;

  @Column({
    type: 'text',
    nullable: true,
  })
  duration: string;

  @ManyToOne((type) => Room, (room) => room.bookingDate)
  room: Room;
}
