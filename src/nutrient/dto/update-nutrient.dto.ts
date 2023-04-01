import { PartialType } from '@nestjs/swagger';
import { CreateNutrientDto } from './create-nutrient.dto';

export class UpdateNutrientDto extends PartialType(CreateNutrientDto) {}
