import { IsEmail, IsString } from 'class-validator';

export class MailPayload {
  @IsString({ message: 'Email is required' })
  @IsEmail({}, { message: 'Email is invalid' })
  email: string;
}
