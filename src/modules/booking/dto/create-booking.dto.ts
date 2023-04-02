import { IsDateString, IsEnum, IsIn, IsNotEmpty, IsNumberString, IsOptional, IsString } from 'class-validator';
import { PaymentType } from 'src/enums/user.enum';

export class CreateBookingDto {
  @IsNotEmpty()
  @IsNumberString()
  customerId: number;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  note?: string;

  @IsNotEmpty()
  @IsString()
  @IsEnum(PaymentType)
  paymentType: PaymentType;

  @IsNotEmpty()
  @IsDateString()
  checkIn: Date;

  @IsNotEmpty()
  @IsDateString()
  checkOut: Date;
}
