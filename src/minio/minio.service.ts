import { Inject, Injectable, Logger } from '@nestjs/common';
import { MINIO_CLIENT } from './minio.constants';
import * as Minio from 'minio';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class MinioService {
  private readonly bucketName = 'heroes-bucket';
  private readonly presignedUrlTTL = 12 * 60 * 60;
  private readonly logger = new Logger(MinioService.name);

  constructor(
    @Inject(MINIO_CLIENT) private readonly minioClient: Minio.Client,
    private readonly redisService: RedisService,
  ) {}

  async uploadFiles(
    heroNickname: string,
    files: Express.Multer.File[],
  ): Promise<string[]> {
    const uploadPromises = files.map(async (file, index) => {
      const fileName = `${Date.now()}-${index}-${file.originalname}`;
      this.logger.log(`Uploading file: ${fileName}`);
      const objectName = `${heroNickname}/${fileName}`;
      this.logger.log(`Object name: ${objectName}`);

      await this.ensureBucketExists();

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

  async getPresignedUrl(
    heroNickname: string,
    fileName: string,
  ): Promise<string | null> {
    const objectName = `${heroNickname}/${fileName}`;
    const cacheKey = `minio:${this.bucketName}/${objectName}`;

    // Here we need to check if the URL is cached in Redis, if so then just return it...
    const cachedUrl = await this.redisService.checkCashe(cacheKey);
    if (cachedUrl) {
      this.logger.debug(`Cache hit for ${cacheKey}`);
      return cachedUrl;
    }

    // Now we need to check if the object is actually exists in MinIO, cause if not then we just can't generate URL for it
    // maybe we need to check it even before checking cache?
    // TODO: think about it
    try {
      await this.minioClient.statObject(this.bucketName, objectName);
    } catch (error) {
      this.logger.warn(`File not found: ${objectName}`);
      return null;
    }

    // We asume that the object exists, so we can generate presigned URL for it
    const presignedUrl = await this.minioClient.presignedUrl(
      'GET',
      this.bucketName,
      objectName,
      this.presignedUrlTTL, // that's the time for which the URL will be valid
    );

    // And finally we need to cache the generated URL in Redis, but with a bit less time than it is valid for
    // so we can be sure that we won't return expired URL from cache at some point like 10 seconds after it expired
    // For example we retuned it from cache, but till that url reached frontend it was already expired - that's bad
    await this.redisService.setWithExparingTime(
      cacheKey,
      presignedUrl,
      this.presignedUrlTTL - 300,
    );

    this.logger.debug(`Generated and cached presigned URL for ${cacheKey}`);
    return presignedUrl;
  }

  async deleteFiles(heroNickname: string, fileNames: string[]): Promise<void> {
    const deletePromises = fileNames.map(async (fileName) => {
      const objectName = `${heroNickname}/${fileName}`;
      const cacheKey = `minio:${this.bucketName}/${objectName}`;

      // Remove from MinIO
      await this.minioClient.removeObject(this.bucketName, objectName);

      // Remove from Redis cache
      // Not sure if we need to await this operation, and maybe we can just pass an array
      // of keys to removeFromCache method?
      // TODO: think about it
      await this.redisService.removeFromCache(cacheKey);
    });

    await Promise.all(deletePromises);
  }

  async renameFile(
    oldHeroNickname: string,
    newHeroNickname: string,
    fileName: string,
  ): Promise<string> {
    const oldObjectName = `${oldHeroNickname}/${fileName}`;
    const newObjectName = `${newHeroNickname}/${fileName}`;
    const cacheKey = `minio:${this.bucketName}/${oldObjectName}`;

    this.logger.debug(
      `Renaming file from ${oldObjectName} to ${newObjectName}`,
    );

    await this.minioClient.copyObject(
      this.bucketName,
      newObjectName,
      `/${this.bucketName}/${oldObjectName}`,
    );

    await this.minioClient.removeObject(this.bucketName, oldObjectName);

    await this.redisService.removeFromCache(cacheKey);

    return newObjectName;
  }

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
