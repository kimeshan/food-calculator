import { Module } from '@nestjs/common';
import { NutrientService } from './nutrient.service';
import { NutrientController } from './nutrient.controller';

@Module({
  controllers: [NutrientController],
  providers: [NutrientService],
})
export class NutrientModule {}
