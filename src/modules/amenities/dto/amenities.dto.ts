import { PartialType } from '@nestjs/mapped-types';
import { IsIn, IsInt, IsNumberString, IsString } from 'class-validator';
import { AMENITIES } from 'src/common/base.constant';

export class CreateAmenitiesDto {
  @IsString()
  @IsIn(AMENITIES)
  name: string;

  @IsString()
  icon: string;

  @IsInt()
  rate: number;
}

export class UpdateAmenitiesDto extends PartialType(CreateAmenitiesDto) {}
