// food-created.dto.ts

import { FoodSource } from '@prisma/client';
import {
  IsDate,
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

  @IsOptional()
  @IsString()
  sourceRefId?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsDate()
  publicationDate?: Date;

  @IsOptional()
  @IsNumber()
  kcal?: number;
}
