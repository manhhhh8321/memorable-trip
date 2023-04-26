import { Test, TestingModule } from '@nestjs/testing';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { PaymentsRepository } from './payment.repository';
import { RedisModuleCache } from '../redis/redis.module';

describe('PaymentController', () => {
  let controller: PaymentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [RedisModuleCache],
      controllers: [PaymentController],
      providers: [
        PaymentService,
        {
          provide: PaymentsRepository,
          useValue: {}, // Replace with the actual instance of the repository
        },
      ],
    }).compile();

    controller = module.get<PaymentController>(PaymentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
