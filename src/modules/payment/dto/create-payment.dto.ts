import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { PaymentType } from 'src/enums/user.enum';

export class CreatePaymentDto {
  @IsNotEmpty()
  @IsNumber()
  readonly bookingId: number;

  @IsNotEmpty()
  @IsEnum(PaymentType)
  readonly paymentType: PaymentType;
}
