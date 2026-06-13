import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe())//uso validation pipe de forma global
  app.use(cookieParser());//importo el cookie-parser

  app.enableCors({
    origin: ['http://localhost:4200', 'https://tribook-frontend.vercel.app'], 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowHeaders: ['Content-Type', 'Accept', 'Authorization'],
    credentials: true,
  })

  console.log('NODE_ENV:', process.env.NODE_ENV);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
