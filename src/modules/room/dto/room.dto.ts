import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsIn,
  IsNotEmpty,
  IsNumber,
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
  userId: number;

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
