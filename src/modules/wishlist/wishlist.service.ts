import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Wishlist } from 'src/entities/wishlist.entity';
import { Repository } from 'typeorm';
import { CreateWishListDto } from './dto/wishlist.dto';
import { RoomService } from '../room/room.service';
import { ErrorHelper } from 'src/helpers/error.utils';
import { UserService } from '../user/user.service';

@Injectable()
export class WishlistService {
  constructor(
    @InjectRepository(Wishlist) private readonly wishlistRepo: Repository<Wishlist>,
    private readonly roomService: RoomService,
    private readonly userService: UserService,
  ) {}

  async createOrRemoveWishlist(userId: number, wishlist: CreateWishListDto) {
    const room = await this.roomService.findById(wishlist.roomId);
    const user = await this.userService.findById(userId);
    if (!room) {
      ErrorHelper.BadRequestException('Room not found');
    }

    const checkWishlist = await this.wishlistRepo.findOne({ where: { user: userId, room: wishlist.roomId } });

    if (checkWishlist) {
      await this.wishlistRepo.delete(checkWishlist.id);
      return 'Remove wishlist successfully';
    }

    const newWishlist = new Wishlist({
      user: user,
      room: room,
    });

    await this.wishlistRepo.save(newWishlist);

    return 'Add room to wishlist successfully';
  }

  async getWishlistByUserId(userId: string) {
    return await this.wishlistRepo.find({ where: { user: userId } });
  }
}
