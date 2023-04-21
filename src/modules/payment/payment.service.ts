import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from 'src/entities';
import { Repository } from 'typeorm';
import { PaymentStatusEnum, PaymentType } from 'src/enums/user.enum';
import { PaymentsRepository } from './payment.repository';
import qs from 'qs';
import axios from 'axios';
import crypto from 'crypto';

@Injectable()
export class PaymentService {
  constructor(private readonly paymentRepo: PaymentsRepository) {}
  async create(paymentType: PaymentType): Promise<Payment> {
    return await this.paymentRepo.create({
      paymentType,
      status: PaymentStatusEnum.PENDING,
      completedAt: null,
    });
  }

  findAll() {
    return `This action returns all payment`;
  }

  findOne(id: number) {
    return `This action returns a #${id} payment`;
  }

  update(id: number, updatePaymentDto: UpdatePaymentDto) {
    return `This action updates a #${id} payment`;
  }

  remove(id: number) {
    return `This action removes a #${id} payment`;
  }
}
