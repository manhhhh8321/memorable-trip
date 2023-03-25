import { Controller, Post, Request, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageKitService } from './imagekit.service';

@Controller('files')
export class FilesController {
  constructor(private readonly imagekitService: ImageKitService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const imageUrl = await this.imagekitService.upload(file);
    return { imageUrl };
  }
}
