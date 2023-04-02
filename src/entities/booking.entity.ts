import { BaseModel } from 'src/base/base.entity';
import { BookingStatusEnum, BookType } from 'src/enums/user.enum';
import { BookingDate, Payment, Room } from 'src/entities/index';

import { User } from 'src/entities/index';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';

@Entity()
export class Booking extends BaseModel {
  constructor(partial: Partial<Booking>) {
    super();
    Object.assign(this, partial);
  }

  @Column({
    type: 'text',
    nullable: true,
  })
  note: string;

  @Column({
    type: 'enum',
    enum: BookingStatusEnum,
  })
  status: BookingStatusEnum;

  @Column({
    type: 'float',
    nullable: true,
  })
  totalDiscount: number;

  @Column({
    type: 'float',
    nullable: true,
  })
  totalPrice: number;

  @ManyToOne((type) => User, (user) => user.booking, { cascade: true })
  user: User;

  @OneToOne(() => Payment)
  @JoinColumn()
  payment: Payment;

  @OneToOne(() => BookingDate)
  @JoinColumn()
  bookingDate: BookingDate;
}
