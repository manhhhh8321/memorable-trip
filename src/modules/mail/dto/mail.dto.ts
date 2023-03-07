import { IsEmail, IsOptional, IsString } from 'class-validator';

export class MailPayload {
  @IsString({ message: 'Email is required' })
  @IsEmail({}, { message: 'Email is invalid' })
  email: string;

  @IsString({ message: 'Content is required' })
  content: string;

  @IsOptional()
  @IsString({ message: 'Subject is required' })
  subject?: string;
}
