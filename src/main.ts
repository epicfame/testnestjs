import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  
  await app.listen(3000);
  const url = await app.getUrl();
  console.log('JWT_SECRET:', process.env.JWT_SECRET);
  console.log(`Application is running on ${url}`)
}
bootstrap();