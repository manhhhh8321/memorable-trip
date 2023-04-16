import { Injectable, Inject } from '@nestjs/common';
import ImageKit from 'imagekit';
import { ErrorHelper } from 'src/helpers/error.utils';

@Injectable()
export class ImageKitService {
  constructor(@Inject('IMAGEKIT') private readonly imagekit: ImageKit) {}

  async upload(files: Express.Multer.File[]) {
    const urls = [];

    for (const file of files) {
      const filename = file.originalname;
      const buffer = file.buffer;

      const response = await this.imagekit.upload({
        file: buffer,
        fileName: filename,
        folder: 'uploads',
        tags: ['uploaded', 'image'],
      });

      console.log('File URL:', response.url);
      urls.push(response.url);
    }

    return urls;
  }

  async deleteImage(url: string): Promise<void> {
    try {
      const response = await this.imagekit.deleteFile(url);

      return response;
    } catch (error) {
      ErrorHelper.BadRequestException(error);
    }
  }
}
