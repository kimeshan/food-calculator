import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FoodModule } from './food/food.module';
import configuration from '../config/configuration';
import { PrismaModule } from 'nestjs-prisma';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    PrismaModule.forRoot(),
    FoodModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
