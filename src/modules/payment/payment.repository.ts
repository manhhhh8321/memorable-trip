import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from 'src/base/base.repository';
import { Repository } from 'typeorm';
import { Payment } from 'src/entities';
import { DeepPartial } from 'typeorm';
@Injectable()
export class PaymentsRepository extends BaseRepository<Payment> {
  constructor(@InjectRepository(Payment) private readonly paymentRepo: Repository<Payment>) {
    super(paymentRepo);
  }
}
