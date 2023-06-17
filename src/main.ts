import { ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import configuration from 'config/configuration';
import { PrismaClientExceptionFilter } from 'nestjs-prisma';
import { AppModule } from './app.module';

async function bootstrap() {
  const config = configuration();
  const app = await NestFactory.create(AppModule);

  // Add CORS Policy
  app.enableCors({
    origin: [
      /http:\/\/localhost:+/,
      /https?:\/\/(www\.)?foodblocks.co+/,
      /https?:\/\/(www\.)?foodblocks.app+/,
      /https?:\/\/(www\.)?food-blocks(-[a-zA-Z0-9-]+)?\.vercel.app/,
    ],
    credentials: true,
  });

  // Add Swagger for API Documentation
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Food Calc API')
    .setDescription('API docs by Kimeshan Naidoo')
    .setVersion('0.1')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  const { httpAdapter } = app.get(HttpAdapterHost);

  // See docs on input validation and using ValidationPipe:
  // https://www.prisma.io/blog/nestjs-prisma-validation-7D056s1kOla1#use-parseintpipe-to-transform-dynamic-url-paths
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));

  await app.listen(config.port);
}
bootstrap();
