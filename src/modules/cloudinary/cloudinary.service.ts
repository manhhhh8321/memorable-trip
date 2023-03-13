import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryConfig } from '../../interfaces/cloudinary.interface';
import * as dotenv from 'dotenv';

dotenv.config();
@Injectable()
export class CloudinaryService {
  private cloudinaryConfig: CloudinaryConfig;

  constructor() {
    this.cloudinaryConfig = {
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
      apiSecret: process.env.CLOUDINARY_API_SECRET,
    };
    cloudinary.config(this.cloudinaryConfig);
  }

  async upload(file: string, options?: Record<string, any>) {
    return cloudinary.uploader.upload(file, options);
  }
}
