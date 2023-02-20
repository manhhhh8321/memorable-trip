import { Injectable } from '@nestjs/common';
import { USER_MESSAGE } from 'src/constants/message.constant';
import { EncryptHelper } from 'src/helpers/encrypt.helper';
import { ErrorHelper } from 'src/helpers/error.utils';
import { CreateUserDto } from './dto/user.dto';
import { UsersRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepo: UsersRepository) {}
  async findById(id: number) {
    return await this.userRepo.findById(id);
  }

  async findByEmail(email: string) {
    return await this.userRepo.findByEmail(email);
  }

  async findByPhone(phone: string) {
    return await this.userRepo.findOne({
      where: {
        phone,
      },
    });
  }

  async createUser(payload: CreateUserDto) {
    const { email, phone } = payload;
    const user = await this.userRepo.findByEmail(email);

    if (user) {
      ErrorHelper.BadRequestException(USER_MESSAGE.EMAIL_ALREADY_EXIST);
    }

    const isPhoneExist = await this.findByPhone(phone);

    if (isPhoneExist) {
      ErrorHelper.BadRequestException(USER_MESSAGE.PHONE_ALREADY_EXIST);
    }

    try {
      payload.password = await EncryptHelper.hash(payload.password);
    } catch (e) {
      throw ErrorHelper.BadRequestException('Hash password failed');
    }

    return await this.userRepo.create(payload);
  }
}
