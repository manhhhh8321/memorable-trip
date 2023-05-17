import {
  IsDateString,
  IsEnum,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';
import { BookingStatusEnum, PaymentType } from 'src/enums/user.enum';

export class CreateBookingDto {
  @IsNotEmpty()
  @IsNumber()
  roomId: number;

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

  @IsOptional()
  @IsEnum(BookingStatusEnum)
  status?: string;
}
