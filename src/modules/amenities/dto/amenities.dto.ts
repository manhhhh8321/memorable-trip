import { PartialType } from '@nestjs/mapped-types';
import { IsArray, IsIn, IsInt, IsNumberString, IsString } from 'class-validator';
import { AMENITIES } from 'src/common/base.constant';

export class CreateAmenitiesDto {
  @IsArray()
  @IsIn(AMENITIES)
  name: string;
}

export class UpdateAmenitiesDto extends PartialType(CreateAmenitiesDto) {}
