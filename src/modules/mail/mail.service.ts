import { Injectable } from '@nestjs/common';
import { ErrorHelper } from 'src/helpers/error.utils';
import { MailPayload } from './dto/mail.dto';
import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';
import { MAIL_MESSAGE } from 'src/constants/message.constant';
dotenv.config();

@Injectable()
export class MailService {
  constructor() {}

  async sendMail(payload: MailPayload) {
    try {
      // let testAccount = await nodemailer.createTestAccount();
      console.log(process.env.SMTP_PASSWORD);
      let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: process.env.SMTP_USERNAME,
          pass: process.env.SMTP_PASSWORD,
        },
      });

      let info = await transporter.sendMail({
        from: 'no-reply@example.com',
        to: payload.email,
        subject: payload.subject,
        html: `<h1>Hi ${payload.content}</h1>`,
      });

      if (!info.messageId) {
        ErrorHelper.BadRequestException(MAIL_MESSAGE.SEND_MAIL_FAILED);
      }

      console.log(info.messageId);
      // console.log(nodemailer.getTestMessageUrl(info));
    } catch (error) {
      ErrorHelper.BadRequestException(error);
    }
  }
}
