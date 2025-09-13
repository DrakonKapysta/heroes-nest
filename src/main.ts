import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SuperheroesModule } from './superheroes/superheroes.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(SuperheroesModule);
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  const config = new DocumentBuilder()
    .setTitle('Superheroes API Documentation')
    .setVersion('1.0')
    .build();
  const documntFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documntFactory);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
