import { NutrientCategory, VitaminSolubility } from '@prisma/client';

// Nutrient Data Factory
export const createNutrientDto = {
  name: 'Vitamin A',
  description: 'Vitamin A is important for vision.',
  category: NutrientCategory.VITAMIN,
  commonName: 'Vitamin A',
  solubility: VitaminSolubility.FAT,
};
