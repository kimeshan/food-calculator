import { BioSex, NutrientCategory, VitaminSolubility } from '@prisma/client';

// Nutrient Data Factory
export const createNutrientDto = {
  name: 'Vitamin A',
  description: 'Vitamin A is important for vision.',
  category: NutrientCategory.VITAMIN,
  commonName: 'Vitamin A',
  solubility: VitaminSolubility.FAT,
};

export const createNutrientRequirementDto = {
  nutrientName: 'Vitamin A',
  standardName: 'World Nutrition Standard',
  sourceURL: 'https://www.nutrition.com/my.pdf',
  yearFrom: 2021,
  ageGroupStart: 228,
  ageGroupEnd: 600,
  amountMicroMg: 700,
  biologicalSex: BioSex.FEMALE,
  source: 'British Nutrition Foundation',
};
