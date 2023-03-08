import { IsEmail, IsNotEmpty, IsNumber, IsPhoneNumber, IsString } from 'class-validator';
import { IsMatchPattern } from 'src/common/validators/IsMatchPattern.validation';
import { PASSWORD_PATTERN } from 'src/constants/base.constant';

export class LoginDto {
  @IsString({ message: 'Email is required' })
  @IsEmail()
  email: string;

  @IsString({ message: 'Password is required' })
  password: string;
}

export class VerifyPayload {
  @IsString({ message: 'Email is required' })
  @IsEmail()
  email: string;

  @IsNotEmpty({ message: 'Code is required' })
  @IsNumber()
  code: number;
}

export class PhoneLoginDto {
  @IsString({ message: 'Phone is required' })
  @IsPhoneNumber('VN')
  phone: string;

  @IsString({ message: 'Code invalid' })
  code: string;
}
