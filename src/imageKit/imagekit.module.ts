import { Module } from '@nestjs/common';
import { ImageKitService } from './imagekit.service';
import ImageKit from 'imagekit';
import { FilesController } from './imagekit.controller';

@Module({
  providers: [
    {
      provide: 'IMAGEKIT',
      useFactory: () =>
        new ImageKit({
          publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
          privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
          urlEndpoint: process.env.IMAGEKIT_ENDPOINT,
        }),
    },
    ImageKitService,
  ],
  exports: [ImageKitService],
  controllers: [FilesController],
})
export class ImageKitModule {}
