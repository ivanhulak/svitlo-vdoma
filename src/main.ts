import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import {
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  // app.use(cookieParser);
  app.enableCors({ origin: 'http://localhost3000' });

  const config = new DocumentBuilder()
    .setTitle('Svitlo Vdoma')
    .addBearerAuth()
    .setDescription('Svitlo Vdoma API description')
    .setExternalDoc('Postman Collection', '/api-json')
    .setVersion('1.0')
    .build();

  const options: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  };

  const document = SwaggerModule.createDocument(app, config, options);
  SwaggerModule.setup('api', app, document);

  await app.listen(8000);
}
bootstrap();
