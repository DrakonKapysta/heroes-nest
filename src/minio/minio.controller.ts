import { Controller, Get, Param } from '@nestjs/common';
import { MinioService } from './minio.service';

@Controller('minio')
export class MinioController {
  constructor(private readonly minioService: MinioService) {}
  @Get('presigned-url/:bucket/:objectName')
  async getPresignedUrl(
    @Param('bucket') bucket: string,
    @Param('objectName') objectName: string,
  ) {
    return this.minioService.getPresignedUrl(bucket, objectName);
  }
}
