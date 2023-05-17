import { Test, TestingModule } from '@nestjs/testing';
import { MailService } from './mail.service';
import { createMock } from '@golevelup/ts-jest';

describe('MailService', () => {
  let service: MailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MailService],
    })
      .useMocker(() => createMock())
      .compile();

    service = module.get<MailService>(MailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
