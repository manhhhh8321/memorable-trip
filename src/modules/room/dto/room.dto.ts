import { PartialType } from '@nestjs/mapped-types';
import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsEnum,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { AMENITIES, DESCRIPTION, VALID_PROVINCES_CODE } from 'src/common/base.constant';
import { RoomType } from 'src/enums/user.enum';

export class RoomDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  roomName: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  price: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  numberOfLivingRoom: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  numberOfBedroom: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  numberOfBed: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  numberOfBathroom: number;

  @IsNotEmpty()
  @IsEnum(RoomType)
  roomType: RoomType;

  @IsNotEmpty()
  @IsString()
  about: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(DESCRIPTION)
  description: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(VALID_PROVINCES_CODE)
  city: string;

  @IsArray()
  @IsNotEmpty()
  @IsIn(AMENITIES, { each: true })
  amenities: string[];

  @IsArray()
  @IsNotEmpty()
  @ArrayMinSize(3)
  image: string[];

  @IsNotEmpty()
  @IsString()
  address: string;
}

export class UpdateRoomDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  roomName: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  price: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  numberOfLivingRoom: number;

  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  numberOfBedroom: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  numberOfBed: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  numberOfBathroom: number;

  @IsOptional()
  @IsEnum(RoomType)
  roomType: RoomType;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  about: string;

  @IsOptional()
  @IsArray()
  @IsNotEmpty()
  @IsIn(AMENITIES, { each: true })
  amenities: string[];

  @IsOptional()
  @IsArray()
  @IsNotEmpty()
  @ArrayMinSize(3)
  image: string[];

  @IsOptional()
  @IsString()
  address: string;
}

export class GetListDto {
  @IsOptional()
  price: number;

  @IsOptional()
  @IsNumberString()
  cityCode: string;

  @IsOptional()
  @IsNumberString()
  description: string;

  @IsOptional()
  @IsArray()
  @IsIn(AMENITIES, { each: true })
  amenities: string[];

  @IsOptional()
  @IsNumberString()
  numberOfLivingRoom: number;

  @IsOptional()
  @IsNumberString()
  numberOfBedroom: number;

  @IsOptional()
  @IsNumberString()
  numberOfBed: number;

  @IsOptional()
  @IsNumberString()
  numberOfBathroom: number;

  @IsOptional()
  @IsEnum(RoomType)
  roomType: RoomType;
}

export class QueryAvailableRoomDto {
  @IsOptional()
  @IsDateString()
  checkIn: Date;

  @IsOptional()
  @IsDateString()
  checkOut: Date;

  @IsOptional()
  @IsString()
  city: string;
}
