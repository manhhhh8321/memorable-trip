import { Injectable } from '@nestjs/common';
import { ErrorHelper } from 'src/helpers/error.utils';

import { CreateUserDto, GetListUserDto, UpdateUserDto } from './dto/user.dto';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private userRepository: UsersRepository) {}

  async findUserByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }

  async createUser(user: CreateUserDto) {
    return this.userRepository.create(user);
  }

  async findById(id: string) {
    return this.userRepository.findById(id);
  }

  async getListUsers(params: GetListUserDto) {
    return this.userRepository.getListUsers(params);
  }

  async updateUser(id: string, params: UpdateUserDto) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      ErrorHelper.BadRequestException('User does not exist');
    }
    return this.userRepository.updateItem({ ...user, ...params });
  }

  async deleteUser(id: string) {
    return this.userRepository.softDeleteItem({ id });
  }
}
