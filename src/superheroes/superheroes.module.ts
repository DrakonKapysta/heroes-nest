import { Module } from '@nestjs/common';
import { SuperheroesService } from './superheroes.service';
import { AuthModule } from 'src/auth/auth.module';
import { SuperheroesController } from './superheroes.controller';
import { MinioModule } from 'src/minio/minio.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    AuthModule,
    MinioModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        endPoint: configService.getOrThrow<string>('MINIO_ENDPOINT'),
        port: configService.getOrThrow<number>('MINIO_PORT'),
        useSSL: configService.getOrThrow<string>('MINIO_USE_SSL') === 'true',
        accessKey: configService.getOrThrow<string>('MINIO_ACCESS_KEY'),
        secretKey: configService.getOrThrow<string>('MINIO_SECRET_KEY'),
      }),
    }),
  ],
  controllers: [SuperheroesController],
  providers: [SuperheroesService],
})
export class SuperheroesModule {}
