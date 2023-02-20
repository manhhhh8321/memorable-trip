import { IsEmail, IsEnum, IsIn, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, MinLength } from 'class-validator';
import { GenderEnum } from 'src/enums/base.enum';
import { UserType } from 'src/enums/user.enum';

export class CreateUserDto {
  @IsOptional()
  @IsEnum(UserType)
  userType: UserType;

  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @IsPhoneNumber('VN')
  phone: string;

  @IsNotEmpty()
  @IsEnum(GenderEnum)
  gender: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;
}
