import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { PrismaService } from './database/prisma.service';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: false
  });

  const configService = app.get(ConfigService);
  const prismaService = app.get(PrismaService);

  app.use(
    helmet({
      crossOriginResourcePolicy: false
    })
  );
  app.use(cookieParser());
  app.enableCors({
    origin: configService.get<string>('FRONTEND_ORIGIN'),
    credentials: true
  });
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true
    })
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new LoggingInterceptor());

  await prismaService.enableShutdownHooks(app);

  const port = configService.get<number>('PORT', 4000);
  await app.listen(port);
}

bootstrap();
