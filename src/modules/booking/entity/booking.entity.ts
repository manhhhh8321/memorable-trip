import { BaseModel } from 'src/base/base.entity';
import { BookingStatusEnum, BookType } from 'src/enums/user.enum';
import { Column, Entity } from 'typeorm';

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
}
