import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { Auth } from 'src/common/decorators/auth.decorator';
import { AuthGuard } from 'src/common/guards/authenticate.guard';
import { UserType } from 'src/enums/user.enum';

import { CreateUserDto, GetListUserDto, UpdateUserDto } from './dto/user.dto';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Get()
  getUsers(@Query() query: GetListUserDto) {
    return this.usersService.getListUsers(query);
  }

  @Post()
  async createUser(@Body() payload: CreateUserDto) {
    return this.usersService.createUser(payload);
  }

  @Get(':id')
  @Auth([
    {
      userType: UserType.CLIENT,
    },
  ])
  findOne(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Put(':id')
  async updateUser(@Param('id') id: string, @Body() payload: UpdateUserDto) {
    return this.usersService.updateUser(id, payload);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }
}
