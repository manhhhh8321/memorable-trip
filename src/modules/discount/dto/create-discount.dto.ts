import { IsDateString, IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';

export class CreateDiscountDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsDateString()
  dueDate: Date;

  @IsNotEmpty()
  @IsNumber()
  roomId: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(80)
  percentage: number;

  isExpired(): boolean {
    const now = new Date();
    return this.dueDate < now;
  }
}
