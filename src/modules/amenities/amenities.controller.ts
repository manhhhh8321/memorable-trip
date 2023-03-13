import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { AmenitiesService } from './amenities.service';
import { CreateAmenitiesDto, UpdateAmenitiesDto } from './dto/amenities.dto';

@Controller('amenities')
export class AmenitiesController {
  constructor(private readonly amenitiesService: AmenitiesService) {}

  @Get('seed')
  async seedAmenities() {
    return await this.amenitiesService.seedAmenities();
  }

  @Get('')
  async getAllAmenities() {
    return await this.amenitiesService.getAllAmenities();
  }

  @Get(':id')
  async getAmenitiesById(@Param('id', new ParseIntPipe()) id: number) {
    return await this.amenitiesService.getAmenitiesById(id);
  }

  @Post('')
  async createAmenities(@Body() payload: CreateAmenitiesDto) {
    return await this.amenitiesService.createAmenities(payload);
  }

  @Put(':id')
  async updateAmenities(@Param('id', new ParseIntPipe()) id: number, @Body() payload: UpdateAmenitiesDto) {
    return await this.amenitiesService.updateAmenities(id, payload);
  }

  @Delete(':id')
  async deleteAmenities(@Param('id', new ParseIntPipe()) id: number) {
    return await this.amenitiesService.deleteAmenities(id);
  }
}
