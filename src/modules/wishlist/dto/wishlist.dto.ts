import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateWishListDto {
  @IsNotEmpty()
  roomId: number;
}
