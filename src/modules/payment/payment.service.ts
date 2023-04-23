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
import { VNP_HASHSECRET, VNP_TMNCODE } from 'src/environments';

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

  async updatePaymentWithTransaction(url: string) {
    if (!url) {
      return 'Url is required';
    }

    const params = new URLSearchParams(url);
    const responseCode = params.get('vnp_ResponseCode');
    const tnxRef = params.get('vnp_TxnRef');
    const payDate = params.get('vnp_PayDate');
    const amount = params.get('vnp_Amount');

    if (!responseCode || !tnxRef || !payDate) {
      return 'Invalid params';
    }

    const year = payDate.slice(0, 4);
    const month = payDate.slice(4, 6);
    const day = payDate.slice(6, 8);
    const hour = payDate.slice(8, 10);
    const minute = payDate.slice(10, 12);
    const second = payDate.slice(12, 14);

    const payDateFormatted = `${year}-${month}-${day} ${hour}:${minute}:${second}`;

    if (responseCode === '00' && tnxRef) {
      const payment = await this.paymentRepo.findOne({ where: { id: tnxRef } });

      if (payment) {
        payment.completedAt = payDateFormatted;
        payment.status = PaymentStatusEnum.COMPLETED;
        payment.amount = Number(amount) / 100 / 23000;
        await this.paymentRepo.updateItem(payment);
      }

      return `Payment success with orderId: ${tnxRef}`;
    } else {
      return `Payment failed with orderId: ${tnxRef}`;
    }
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
