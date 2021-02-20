import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './App/app.module';
import { EnvKeyEnum } from './App/Enum/env-key.enum';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);

  app.enableCors();

  app.setBaseViewsDir(join(__dirname, '..', 'views'));

  app.setViewEngine('ejs');

  const options = new DocumentBuilder()
    .setTitle(configService.get(EnvKeyEnum.SwaggerTitle))
    .setDescription(configService.get(EnvKeyEnum.SwaggerDescription))
    .setVersion(configService.get(EnvKeyEnum.SwaggerVersion))
    .build();

  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup(configService.get(EnvKeyEnum.SwaggerUri), app, document);

  await app.listen(3000);
}

bootstrap();
