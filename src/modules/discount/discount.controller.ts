import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, ParseIntPipe } from '@nestjs/common';
import { DiscountService } from './discount.service';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { UpdateDiscountDto } from './dto/update-discount.dto';
import { AuthGuard } from 'src/common/guards/authenticate.guard';
import { Auth } from 'src/common/decorators/auth.decorator';
import { UserType } from 'src/enums/user.enum';
import { UserService } from '../user/user.service';

@Controller('discount')
export class DiscountController {
  constructor(private readonly discountService: DiscountService, private readonly userService: UserService) {}

  @Post()
  @UseGuards(AuthGuard)
  @Auth([
    {
      userType: UserType.CLIENT,
    },
    {
      userType: UserType.OWNER,
    },
  ])
  create(@Body() createDiscountDto: CreateDiscountDto, @Req() req: any) {
    const userId = req.user.id;
    return this.discountService.create(userId, createDiscountDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  @Auth([
    {
      userType: UserType.CLIENT,
    },
    {
      userType: UserType.OWNER,
    },
    ,
    {
      userType: UserType.ADMIN,
    },
  ])
  async findAll(@Req() req: any) {
    const userId = req.user.id;

    const user = await this.userService.findById(userId);

    if (user.userType === UserType.ADMIN) {
      return this.discountService.findAll();
    }
    return this.discountService.findAll(userId);
  }

  @Patch(':id')
  update(@Param('id', new ParseIntPipe()) id: string, @Body() updateDiscountDto: UpdateDiscountDto) {
    return this.discountService.update(+id, updateDiscountDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.discountService.remove(+id);
  }
}
