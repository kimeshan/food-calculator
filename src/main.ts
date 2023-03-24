import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import configuration from 'config/configuration';
import { AppModule } from './app.module';

async function bootstrap() {
  const config = configuration();
  const app = await NestFactory.create(AppModule);

  // Add Swagger for API Documentation
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Food Calc API')
    .setDescription('API docs by Kimeshan Naidoo')
    .setVersion('0.1')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  await app.listen(config.port);
}
bootstrap();
