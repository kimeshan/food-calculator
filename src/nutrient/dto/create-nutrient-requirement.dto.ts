import {
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { BioSex } from '@prisma/client';

export class CreateNutrientRequirementDto {
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  standardName: string;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  source: string;

  @IsUrl()
  @MinLength(1)
  sourceURL: string;

  @IsNumber()
  @Min(2010)
  yearFrom: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  ageGroupStart?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  ageGroupEnd?: number;

  @IsOptional()
  biologicalSex?: BioSex;

  @IsNumber()
  amountMicroMg: number;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  nutrientName: string;
}
