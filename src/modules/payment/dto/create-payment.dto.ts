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
}

export class VnpParamsDto {
  @IsNotEmpty()
  @IsString()
  vnp_TxnRef: string;

  @IsNotEmpty()
  @IsString()
  vnp_ResponseCode: string;

  [key: string]: any;
}
