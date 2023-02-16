import { BaseModel } from 'src/base/base.entity';
import { BookingStatusEnum, BookType } from 'src/enums/user.enum';
import { Payment } from 'src/entities/payment.entity';
import { User } from 'src/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';

@Entity()
export class Booking extends BaseModel {
  constructor(partial: Partial<Booking>) {
    super();
    Object.assign(this, partial);
  }

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  checkIn: string;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  checkOut: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  note: string;

  @Column({
    type: 'enum',
    enum: BookType,
  })
  bookType: BookType;

  @Column({
    type: 'enum',
    enum: BookingStatusEnum,
  })
  status: BookingStatusEnum;

  @Column({
    type: 'text',
    nullable: true,
  })
  ref: string;

  @ManyToOne((type) => User, (user) => user.booking, { cascade: true })
  user: User;

  @OneToOne(() => Payment)
  @JoinColumn()
  payment: Payment;
}
