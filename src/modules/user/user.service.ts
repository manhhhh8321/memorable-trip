import { Injectable } from '@nestjs/common';
import lodash from 'lodash';
import { USER_MESSAGE } from 'src/constants/message.constant';
import { User } from 'src/entities';
import { EncryptHelper } from 'src/helpers/encrypt.helper';
import { ErrorHelper } from 'src/helpers/error.utils';
import { DeepPartial } from 'typeorm';
import { AuthService } from '../auth/auth.service';
import { CreateUserDto } from './dto/user.dto';
import { UsersRepository } from './user.repository';
import { MockUser } from 'src/common/MOCK_DATA (2)';

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

  async updateUser(id: number, payload: DeepPartial<User>): Promise<User> {
    const user = await this.findById(id);

    if (!user) {
      ErrorHelper.NotFoundException(USER_MESSAGE.USER_NOT_FOUND);
    }

    const isMailExist = await this.userRepo.findOne({
      where: {
        email: payload.email,
      },
    });

    if (isMailExist && isMailExist.id !== id) {
      ErrorHelper.BadRequestException(USER_MESSAGE.EMAIL_ALREADY_EXIST);
    }

    const isPhoneExist = await this.userRepo.findOne({
      where: {
        phone: payload.phone,
      },
    });

    if (isPhoneExist && isPhoneExist.id !== id) {
      ErrorHelper.BadRequestException(USER_MESSAGE.PHONE_ALREADY_EXIST);
    }

    if (payload.password) {
      try {
        payload.password = await EncryptHelper.hash(payload.password);
      } catch (e) {
        throw ErrorHelper.BadRequestException('Hash password failed');
      }
    }

    const updatedUser = await this.userRepo.update(id, payload);
    return await this.userRepo.findById(id);
  }

  async update(id: number, payload: DeepPartial<User>) {
    return await this.userRepo.update(id, payload);
  }

  async delete(id: number): Promise<void> {
    await this.userRepo.removeItem(id);
  }

  async seedUser() {
    MockUser.forEach(async (user) => {
      const randomPassword = Math.random().toString(36).slice(-8);
      await this.createUser({
        ...user,
        firstName: user.first_name,
        lastName: user.last_name,
        password: randomPassword,
      });
    });
    return 'Seed user success';
  }
}
