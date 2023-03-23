import { NestFactory } from '@nestjs/core';
import configuration from 'config/configuration';
import { AppModule } from './app.module';

async function bootstrap() {
  const config = configuration();
  const app = await NestFactory.create(AppModule);
  await app.listen(config.port);
}
bootstrap();
