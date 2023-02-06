import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { BaseRepository } from 'src/base/base.repository';
import { Repository } from 'typeorm';

import { GetListUserDto } from './dto/user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersRepository extends BaseRepository<User> {
  constructor(@InjectRepository(User) readonly userModel: Repository<User>) {
    super(userModel);
  }

  async getListUsers(args: GetListUserDto) {
    const { page = 1, limit = 10 } = args;
    const options: IPaginationOptions = {
      page,
      limit,
    };
    // save query redis with time 30s
    const searchOptions = {
      cache: 30000,
    };

    return this.paginationRepository(this.userModel, options, searchOptions);
  }

  async pagination() {
    return this.paginationRepository(this.userModel, { limit: 10, page: 1 });
  }
}
