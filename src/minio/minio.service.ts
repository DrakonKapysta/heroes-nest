import { Inject, Injectable, Logger } from '@nestjs/common';
import { MINIO_CLIENT } from './minio.constants';
import * as Minio from 'minio';

@Injectable()
export class MinioService {
  private readonly bucketName = 'heroes-bucket';
  private readonly presignedUrlTTL = 12 * 60 * 60;
  private readonly logger = new Logger(MinioService.name);

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

  async uploadFiles(
    heroId: string,
    files: Express.Multer.File[],
  ): Promise<string[]> {
    const uploadPromises = files.map(async (file, index) => {
      const fileName = `${Date.now()}-${index}-${file.originalname}`;
      const objectName = `${heroId}/${fileName}`;

      await this.minioClient.putObject(
        this.bucketName,
        objectName,
        file.buffer,
        file.size,
        {
          'Content-Type': file.mimetype,
        },
      );

      return fileName;
    });

    return Promise.all(uploadPromises);
  }

  // async getPresignedUrl(heroId: string, fileName: string): Promise<string> {
  //   const objectName = `${heroId}/${fileName}`;
  //   const cacheKey = `minio:${this.bucketName}/${objectName}`;

  //   // Проверяем кеш
  //   const cachedUrl = await this.redis.get(cacheKey);
  //   if (cachedUrl) {
  //     this.logger.debug(`Cache hit for ${cacheKey}`);
  //     return cachedUrl;
  //   }

  //   // Проверяем существование файла
  //   try {
  //     await this.minioClient.statObject(this.bucketName, objectName);
  //   } catch (error) {
  //     this.logger.warn(`File not found: ${objectName}`);
  //     return null;
  //   }

  //   // Генерируем presigned URL
  //   const presignedUrl = await this.minioClient.presignedUrl(
  //     'GET',
  //     this.bucketName,
  //     objectName,
  //     this.presignedUrlTTL,
  //   );

  //   // Кешируем в Redis с TTL чуть меньше чем у URL
  //   await this.redis.setex(cacheKey, this.presignedUrlTTL - 300, presignedUrl);

  //   this.logger.debug(`Generated and cached presigned URL for ${cacheKey}`);
  //   return presignedUrl;
  // }

  // async deleteFiles(heroId: string, fileNames: string[]): Promise<void> {
  //   const deletePromises = fileNames.map(async (fileName) => {
  //     const objectName = `${heroId}/${fileName}`;
  //     const cacheKey = `minio:${this.bucketName}/${objectName}`;

  //     // Удаляем файл
  //     await this.minioClient.removeObject(this.bucketName, objectName);

  //     // Удаляем из кеша
  //     await this.redis.del(cacheKey);
  //   });

  //   await Promise.all(deletePromises);
  // }

  private async ensureBucketExists() {
    try {
      const exists = await this.minioClient.bucketExists(this.bucketName);
      if (!exists) {
        await this.minioClient.makeBucket(this.bucketName);
        this.logger.log(`Bucket ${this.bucketName} created`);
      }
    } catch (error) {
      this.logger.error('Error ensuring bucket exists', error);
    }
  }
}
