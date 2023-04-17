import { Injectable } from '@nestjs/common';
import { ErrorHelper } from 'src/helpers/error.utils';
import { MailPayload } from './dto/mail.dto';
import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';
import { MAIL_MESSAGE } from 'src/constants/message.constant';
import { MailerService } from '@nestjs-modules/mailer';
dotenv.config();

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendMail(payload: MailPayload) {
    try {
      // let testAccount = await nodemailer.createTestAccount();
      let info = await this.mailerService.sendMail({
        from: 'no-reply@example.com',
        to: payload.email,
        subject: payload.subject,
        context: {
          code: payload.content,
        },
        template: 'verify-email',
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

  async sendConfirmBookingMail(payload, content) {
    try {
      // let testAccount = await nodemailer.createTestAccount();
      let info = await this.mailerService.sendMail({
        from: 'no-reply@memotrip.com',
        to: payload.email,
        subject: payload.subject,
        context: content,
        template: 'confirm-booking',
      });

      if (!info.messageId) {
        ErrorHelper.BadRequestException(MAIL_MESSAGE.SEND_MAIL_FAILED);
      }
    } catch (error) {
      ErrorHelper.BadRequestException(error);
    }
  }
}
