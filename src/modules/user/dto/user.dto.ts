import { PartialType } from '@nestjs/mapped-types';
import { IsEmail, IsEnum, IsIn, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, MinLength } from 'class-validator';
import { GenderEnum } from 'src/enums/base.enum';
import { UserType } from 'src/enums/user.enum';

export class CreateUserDto {
  @IsNotEmpty({ message: 'First name is required' })
  @IsString({ message: 'First name must be a string' })
  firstName: string;

  @IsNotEmpty({ message: 'Last name is required' })
  @IsString({ message: 'Last name must be a string' })
  lastName: string;

  @IsNotEmpty({ message: 'Email is required' })
  @IsString({ message: 'Must be a valid email' })
  @IsEmail()
  email: string;

  @IsNotEmpty({ message: 'Phone is required' })
  @IsString({ message: 'Must be a valid phone number' })
  @IsPhoneNumber('VN')
  phone: string;

  @IsNotEmpty({ message: 'Gender is required' })
  @IsEnum(GenderEnum, { message: 'Gender is not valid' })
  gender: string;

  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: 'Invalid password' })
  @MinLength(6)
  password: string;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
