import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import * as expressHbs from 'express-handlebars';
import * as hbs from 'hbs';

async function bootstrap() {

  const app = await NestFactory.create<NestExpressApplication>(
    AppModule, {
    logger: ['debug', 'verbose', 'error', 'warn', 'log'],
    cors: true
  }
  );

  app.useGlobalPipes(new ValidationPipe());
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.engine(
    'hbs',
    expressHbs({
      layoutsDir: join(__dirname, '..', 'views/layouts'),
      defaultLayout: 'layout',
      extname: 'hbs',
    }),
  );
  hbs.registerPartials(__dirname + '/views/partials');
  app.setViewEngine('hbs');
  app.use(cookieParser());

  const config = new DocumentBuilder()
    .setTitle('News blog`s API')
    .setDescription('The news API description  - all interaction methods')
    .setVersion('1.0')
    .addTag('news, users, comments')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.enableCors();
  await app.listen(3000);
}
bootstrap();
