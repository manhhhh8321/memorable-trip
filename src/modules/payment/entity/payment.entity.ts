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
    enum: PaymentType,
  })
  paymentType: PaymentType;

  @Column({
    type: 'enum',
    enum: PaymentStatusEnum,
  })
  status: PaymentStatusEnum;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  completedAt: string;
}
