import { Inject, Injectable } from '@nestjs/common';
import { MINIO_CLIENT } from './minio.constants';
import * as Minio from 'minio';

@Injectable()
export class MinioService {
  constructor(
    @Inject(MINIO_CLIENT) private readonly minioClient: Minio.Client,
  ) {}

  async getPresignedUrl(
    bucket: string,
    objectName: string,
    expiresInSec = 3600,
  ): Promise<string> {
    return this.minioClient.presignedGetObject(
      bucket,
      objectName,
      expiresInSec,
    );
  }
}
