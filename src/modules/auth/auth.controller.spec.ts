import { createMock } from '@golevelup/ts-jest';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from 'src/modules/auth/auth.controller';
import { AuthModule } from 'src/modules/auth/auth.module';
import { AuthService } from 'src/modules/auth/auth.service';

describe('AuthController', () => {
  let authController: AuthController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [AuthModule, ConfigModule],
    })
      .useMocker(() => createMock())
      .compile();

    authController = app.get<AuthController>(AuthController);
  });

  describe('root', () => {
    it('should be  defined', () => {
      expect(authController).toBeDefined();
    });
  });
});
