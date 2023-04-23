import { BaseModel } from 'src/base/base.entity';
import { PaymentStatusEnum, PaymentType } from 'src/enums/user.enum';
import { Column, Entity } from 'typeorm';

@Entity()
export class Payment extends BaseModel {
  constructor(partial: Partial<Payment>) {
    super();
    Object.assign(this, partial);
  }

  @Column({
    type: 'enum',
    enum: ['CASH', 'CARD'],
    enumName: 'payment_type',
  })
  paymentType: PaymentType;

  @Column({
    type: 'enum',
    enum: ['PENDING', 'COMPLETED'],
    enumName: 'payment_status',
  })
  status: PaymentStatusEnum;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  completedAt: string;

  @Column({
    type: 'float',
    nullable: true,
  })
  amount: number;
}
