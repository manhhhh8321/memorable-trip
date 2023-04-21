import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Redirect,
  Query,
  ExecutionContext,
  Res,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentUrlDto, CreatePaymentDto, VnpParamsDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import moment from 'moment';
import { VNP_HASHSECRET, VNP_TMNCODE } from 'src/environments';
import qs from 'qs';
import crypto from 'crypto';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get()
  findAll() {
    return this.paymentService.findAll();
  }

  @Get('create_payment_url')
  @Redirect()
  createPaymentUrl(@Query() payload: CreatePaymentUrlDto) {
    const { amount, orderDescription, bankCode, language, orderType } = payload;
    const ipAddr = '192.168.1.100';
    const tmnCode = VNP_TMNCODE;
    const secretKey = VNP_HASHSECRET;
    const vnpUrl = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
    const returnUrl = 'http://localhost:3000/payment/return';
    const date = new Date();
    const createDate = moment(date).format('YYYYMMDDHHmmss');
    const orderId = moment(date).format('HHmmss');
    const currCode = 'VND';

    const vnpParams = {
      vnp_Version: '2.0.1',
      vnp_Command: 'pay',
      vnp_TmnCode: tmnCode,
      vnp_Locale: 'vn',
      vnp_CurrCode: currCode,
      vnp_TxnRef: orderId,
      vnp_OrderInfo: orderDescription,
      vnp_OrderType: orderType,
      vnp_Amount: amount * 100,
      vnp_ReturnUrl: returnUrl,
      vnp_IpAddr: ipAddr,
      vnp_CreateDate: createDate,
    };

    if (bankCode) {
      vnpParams['vnp_BankCode'] = bankCode;
    }

    const sortedVnpParams = this.sortObject(vnpParams);
    const signData = qs.stringify(sortedVnpParams, { encode: false });
    const hmac = crypto.createHmac('sha512', secretKey);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
    const vnpSecureHash = signed;

    const redirectUrl =
      vnpUrl + '?' + qs.stringify({ ...sortedVnpParams, vnp_SecureHash: vnpSecureHash }, { encode: false });

    return { url: redirectUrl, statusCode: 302 };
  }

  // @Get('verify_payment')
  // handleIpn(@Query() vnpParams: VnpParamsDto, @Res() res: Response) {
  //   const secretKey = VNP_HASHSECRET;
  //   const secureHash = vnpParams.vnp_SecureHash;
  //   const orderId = vnpParams.vnp_TxnRef;
  //   const rspCode = vnpParams.vnp_ResponseCode;

  //   delete vnpParams.vnp_SecureHash;
  //   delete vnpParams.vnp_SecureHashType;

  //   vnpParams = this.sortObject(vnpParams);

  //   const signData = qs.stringify(vnpParams, { encode: false });
  //   const hmac = crypto.createHmac('sha512', secretKey);
  //   const signed = hmac.update(new Buffer(signData, 'utf-8')).digest('hex');

  //   if (secureHash === signed) {
  //     //Kiem tra du lieu co hop le khong, cap nhat trang thai don hang va gui ket qua cho VNPAY theo dinh dang duoi
  //     res.status(200).json({ RspCode: '00', Message: 'success' });
  //   } else {
  //     res.status(200).json({ RspCode: '97', Message: 'Fail checksum' });
  //   }
  // }

  private sortObject(obj: Record<string, any>) {
    return Object.keys(obj)
      .sort()
      .reduce((result, key) => {
        result[key] = obj[key];
        return result;
      }, {});
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto) {
    return this.paymentService.update(+id, updatePaymentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paymentService.remove(+id);
  }
}
