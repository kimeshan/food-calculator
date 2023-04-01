import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { NutrientCategory, VitaminSolubility } from '@prisma/client';

export class CreateNutrientDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(255)
  name: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  commonName?: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(1000)
  description: string;

  @IsEnum(NutrientCategory)
  category: NutrientCategory;

  @IsOptional()
  @IsEnum(VitaminSolubility)
  solubility?: VitaminSolubility;
}
