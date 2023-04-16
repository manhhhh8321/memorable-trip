import { Controller, Param, Post, Delete, Request, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ImageKitService } from './imagekit.service';

@Controller('files')
export class FilesController {
  constructor(private readonly imagekitService: ImageKitService) {}

  @Post('upload')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadFiles(@UploadedFiles() files: Express.Multer.File[]) {
    return this.imagekitService.upload(files);
  }

  @Delete(':url')
  async deleteImage(@Param('url') url: string): Promise<void> {
    await this.imagekitService.deleteImage(url);
  }
}
