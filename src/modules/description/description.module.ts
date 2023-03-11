import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Description } from 'src/entities';
import { DescriptionService } from './description.service';

@Module({
  imports: [TypeOrmModule.forFeature([Description])],
  providers: [DescriptionService],
  exports: [DescriptionService, TypeOrmModule],
})
export class DescriptionModule {}
