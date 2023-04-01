import { Module } from '@nestjs/common';
import { NutrientService } from './nutrient.service';
import { NutrientController } from './nutrient.controller';
import { PrismaService } from 'nestjs-prisma';

@Module({
  controllers: [NutrientController],
  providers: [NutrientService, PrismaService],
})
export class NutrientModule {}
