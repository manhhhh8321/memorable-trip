import { Test, TestingModule } from '@nestjs/testing';
import { BookingService } from './booking.service';
import { createMock } from '@golevelup/ts-jest';

describe('BookingService', () => {
  let service: BookingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BookingService],
    })
      .useMocker(() => createMock())
      .compile();

    service = module.get<BookingService>(BookingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
