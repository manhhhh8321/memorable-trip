import { Body, Controller, Get, ParseIntPipe, Post } from '@nestjs/common';
import { Delete, HttpCode, Param, Put, Query, Req, UseGuards } from '@nestjs/common/decorators';
import { Auth } from 'src/common/decorators/auth.decorator';
import { AuthGuard } from 'src/common/guards/authenticate.guard';
import { UserType } from 'src/enums/user.enum';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('')
  @UseGuards(AuthGuard)
  @Auth([
    {
      userType: UserType.ADMIN,
    },
  ])
  async findAll(@Query('page') page: number, @Query('limit') limit: number) {
    page ? page : (page = 1);
    limit ? limit : (limit = 10);
    return await this.userService.findAll(page, limit);
  }

  @Post()
  @UseGuards(AuthGuard)
  @Auth([
    {
      userType: UserType.ADMIN,
    },
  ])
  @HttpCode(201)
  async createUser(@Body() payload: CreateUserDto) {
    return await this.userService.createUser(payload);
  }

  @Get('/:id')
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
  async findById(@Req() req: any, @Param('id', new ParseIntPipe()) id: number) {
    const userId = req.user.id;

    const user = await this.userService.findById(userId);

    if (user.userType === UserType.ADMIN) {
      return await this.userService.findById(id);
    }

    return await this.userService.findById(userId);
  }

  @Put('/:id')
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
  async updateUser(@Req() req: any, @Body() payload: UpdateUserDto, @Param('id', new ParseIntPipe()) id: number) {
    const userId = req.user.id;

    const user = await this.userService.findById(userId);

    if (user.userType === UserType.ADMIN) {
      return await this.userService.updateUser(id, payload);
    }
    return await this.userService.updateUser(userId, payload);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard)
  @Auth([
    {
      userType: UserType.ADMIN,
    },
  ])
  async deleteUser(@Req() req: any, @Param('id', new ParseIntPipe()) id: number) {
    return await this.userService.delete(id);
  }

  // @Get('/seed')
  // async seed() {
  //   return await this.userService.seedUser();
  // }
}
