// food-created.dto.ts

import { FoodSource } from '@prisma/client';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateFoodDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MinLength(255)
  name: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  numberOfGrams: number;

  @IsNotEmpty()
  @IsEnum(FoodSource)
  source: FoodSource;
}
