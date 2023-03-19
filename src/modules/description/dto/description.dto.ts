import { IsIn, IsNotEmpty, IsString } from 'class-validator';
import { DESCRIPTION } from 'src/common/base.constant';

export class DescriptionDto {
  @IsNotEmpty()
  @IsString()
  @IsIn(DESCRIPTION)
  title: string;
}
