import { Test, TestingModule } from '@nestjs/testing';
import { PaymentService } from './payment.service';
import { RedisModuleCache } from '../redis/redis.module';
import { PaymentController } from './payment.controller';
import { PaymentsRepository } from './payment.repository';

describe('PaymentService', () => {
  let service: PaymentService;

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

    service = module.get<PaymentService>(PaymentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
