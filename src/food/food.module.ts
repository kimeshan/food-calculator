import { Module } from '@nestjs/common';
import { FoodService } from './food.service';
import { FoodController } from './food.controller';
import { NutrientService } from '../nutrient/nutrient.service';
import { PrismaService } from 'nestjs-prisma';

@Module({
  controllers: [FoodController],
  providers: [FoodService, NutrientService, PrismaService],
})
export class FoodModule {}
