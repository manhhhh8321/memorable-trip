import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  async findById(id: string) {
    return {
      userType: 'user',
      permissions: ['read'],
    };
  }

  async findByEmail(email: string) {
    return {
      id: 123,
      password: '123',
    };
  }
}
