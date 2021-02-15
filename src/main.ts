import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './App/app.module';
import { EnvKeyEnum } from './App/Enum/env-key.enum';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.enableCors();

  const options = new DocumentBuilder()
    .setTitle(configService.get(EnvKeyEnum.SwaggerTitle))
    .setDescription(configService.get(EnvKeyEnum.SwaggerDescription))
    .setVersion(configService.get(EnvKeyEnum.SwaggerVersion))
    .addBearerAuth({ in: 'header', type: 'http' })
    .build();

  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup(configService.get(EnvKeyEnum.SwaggerUri), app, document);

  await app.listen(3000);
}

bootstrap();
