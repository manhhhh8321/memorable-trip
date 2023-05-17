import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from 'src/base/base.repository';
import { Repository } from 'typeorm';
import { User } from 'src/entities';
import { CreateUserDto } from './dto/user.dto';
import { DeepPartial } from 'typeorm';
@Injectable()
export class UsersRepository extends BaseRepository<User> {
  constructor(@InjectRepository(User) private readonly userRepo: Repository<User>) {
    super(userRepo);
  }

  async findByEmail(email: string): Promise<User> {
    return await this.userRepo.findOne({
      where: {
        email,
      },
    });
  }

  async findByPhone(phone: string): Promise<User> {
    return await this.userRepo.findOne({
      where: {
        phone,
      },
    });
  }

  async update(id: number, payload: DeepPartial<User>) {
    return await this.userRepo.update(id, payload);
  }
}
