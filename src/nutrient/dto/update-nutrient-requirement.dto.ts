import { PartialType } from '@nestjs/swagger';
import { CreateNutrientRequirementDto } from './create-nutrient-requirement.dto';

export class UpdateNutrientRequirementDto extends PartialType(
  CreateNutrientRequirementDto,
) {}
