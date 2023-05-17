import { IsEnum, IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString } from 'class-validator';
import { PaymentType } from 'src/enums/user.enum';

export class CreatePaymentDto {
  @IsNotEmpty()
  @IsNumber()
  readonly bookingId: number;

  @IsNotEmpty()
  @IsEnum(PaymentType)
  readonly paymentType: PaymentType;
}

export class CreatePaymentUrlDto {
  @IsNotEmpty()
  @IsNumberString()
  amount: number;

  @IsOptional()
  @IsString()
  bankCode?: string;

  @IsNotEmpty()
  @IsString()
  orderDescription: string;

  @IsOptional()
  @IsString()
  orderType?: string;

  @IsOptional()
  @IsString()
  language?: string;

  @IsNotEmpty()
  @IsNumberString()
  orderId: number;
}

export class VnpParamsDto {
  @IsNotEmpty()
  @IsString()
  url: string;
}
