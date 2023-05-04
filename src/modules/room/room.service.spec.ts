import { Test, TestingModule } from '@nestjs/testing';
import { RoomService } from './room.service';
import { createMock } from '@golevelup/ts-jest';

describe('RoomService', () => {
  let service: RoomService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoomService],
    })
      .useMocker(() => createMock())
      .compile();

    service = module.get<RoomService>(RoomService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
