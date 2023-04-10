import { Module } from '@nestjs/common';
import { FoodService } from './food.service';
import { FoodController } from './food.controller';
import { NutrientService } from '../nutrient/nutrient.service';

@Module({
  controllers: [FoodController],
  providers: [FoodService, NutrientService],
})
export class FoodModule {}
