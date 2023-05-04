import { Test, TestingModule } from '@nestjs/testing';
import { DiscountService } from './discount.service';
import { createMock } from '@golevelup/ts-jest';

describe('DiscountService', () => {
  let service: DiscountService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DiscountService],
    })
      .useMocker(() => createMock())
      .compile();

    service = module.get<DiscountService>(DiscountService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
