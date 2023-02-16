import { PaymentType } from 'src/enums/user.enum';

export interface IPayment {
  id: number;
  paymentType: PaymentType;
  status: string;
  completedAt: string;
}
