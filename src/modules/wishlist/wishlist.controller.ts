import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { CreateWishListDto } from './dto/wishlist.dto';
import { WishlistService } from './wishlist.service';
import { AuthGuard } from 'src/common/guards/authenticate.guard';
import { Auth } from 'src/common/decorators/auth.decorator';
import { UserType } from 'src/enums/user.enum';

@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @UseGuards(AuthGuard)
  @Auth([
    {
      userType: UserType.CLIENT,
    },
    {
      userType: UserType.OWNER,
    },
    {
      userType: UserType.ADMIN,
    },
  ])
  @Post()
  async createWishlist(@Body() wishlist: CreateWishListDto, @Req() req: any) {
    const userId = req.user.id;
    return await this.wishlistService.createOrRemoveWishlist(userId, wishlist);
  }

  @UseGuards(AuthGuard)
  @Auth([
    {
      userType: UserType.CLIENT,
    },
    {
      userType: UserType.OWNER,
    },
    {
      userType: UserType.ADMIN,
    },
  ])
  @Get()
  async getWishlistByUserId(@Req() req: any) {
    const userId = req.user.id;
    return await this.wishlistService.getWishlistByUserId(userId);
  }
}
