import { Module } from '@nestjs/common';
import { ImageKitService } from './imagekit.service';
import ImageKit from 'imagekit';
import { FilesController } from './imagekit.controller';
import { IMAGEKIT_PUBLIC_KEY, IMAGEKIT_ENDPOINT, IMAGEKIT_PRIVATE_KEY } from 'src/environments';

@Module({
  providers: [
    {
      provide: 'IMAGEKIT',
      useFactory: () =>
        new ImageKit({
          publicKey: IMAGEKIT_PUBLIC_KEY,
          privateKey: IMAGEKIT_PRIVATE_KEY,
          urlEndpoint: IMAGEKIT_ENDPOINT,
        }),
    },
    ImageKitService,
  ],
  exports: [ImageKitService],
  controllers: [FilesController],
})
export class ImageKitModule {}
