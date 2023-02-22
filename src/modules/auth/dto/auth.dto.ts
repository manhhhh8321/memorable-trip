import { IsEmail, IsString } from 'class-validator';
import { IsMatchPattern } from 'src/common/validators/IsMatchPattern.validation';
import { PASSWORD_PATTERN } from 'src/constants/base.constant';

export class LoginDto {
  @IsString({ message: 'Email is required' })
  @IsEmail()
  email: string;

  @IsString({ message: 'Password is required' })
  password: string;
}
