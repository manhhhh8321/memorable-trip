import { Injectable, Inject } from '@nestjs/common';
import ImageKit from 'imagekit';

@Injectable()
export class ImageKitService {
  constructor(@Inject('IMAGEKIT') private readonly imagekit: ImageKit) {}

  async upload(file: Express.Multer.File) {
    const filename = file.originalname;
    const buffer = file.buffer;

    const response = await this.imagekit.upload({
      file: buffer,
      fileName: filename,
      folder: 'uploads',
      tags: ['uploaded', 'image'],
    });

    console.log('File URL:', response.url);
    return response.url;
  }
}
