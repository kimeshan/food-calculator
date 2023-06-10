import { Injectable, Param, ParseIntPipe } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateNutrientDto } from './dto/create-nutrient.dto';
import { UpdateNutrientDto } from './dto/update-nutrient.dto';
import * as nutrients from '../../prisma/seed_data/nutrients.json';
import {
  NutrientCategory,
  VitaminSolubility,
  BioSex,
  Nutrient,
  FoodNutrientSource,
  DerivationMethodology,
} from '@prisma/client';
import * as UKNutrientRequirements from '../../prisma/seed_data/uk_nutrition_req.json';
import { CreateNutrientRequirementDto } from './dto/create-nutrient-requirement.dto';

@Injectable()
export class NutrientService {
  constructor(private readonly prisma: PrismaService) {}
  create(createNutrientDto: CreateNutrientDto) {
    return this.prisma.nutrient.create({ data: createNutrientDto });
  }

  upsert(createNutrientDto: CreateNutrientDto) {
    return this.prisma.nutrient.upsert({
      where: { name: createNutrientDto?.name },
      update: createNutrientDto,
      create: createNutrientDto,
    });
  }
  upsertFoodNutrient(
    nutrientId: number,
    foodId: number,
    amountMicroMg: number,
    derivationMethodology: DerivationMethodology,
    source: FoodNutrientSource,
    sourceUrl: string,
    publicationDate: Date = null,
  ) {
    return this.prisma.foodNutrient.upsert({
      where: { foodId_nutrientId_source: { nutrientId, foodId, source } },
      update: {},
      create: {
        foodId,
        nutrientId,
        amountMicroMg,
        derivationMethodology,
        source,
        sourceUrl,
        publicationDate,
      },
    });
  }

  findAll() {
    return this.prisma.nutrient.findMany();
  }

  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.prisma.nutrient.findUnique({ where: { id } });
  }

  findOneByName(name: string) {
    return this.prisma.nutrient.findUnique({ where: { name } });
  }

  update(
    @Param('id', ParseIntPipe) id: number,
    updateNutrientDto: UpdateNutrientDto,
  ) {
    return this.prisma.nutrient.update({
      where: { id },
      data: updateNutrientDto,
    });
  }

  remove(@Param('id', ParseIntPipe) id: number) {
    return this.prisma.nutrient.delete({ where: { id } });
  }
  /**
   * Function that adds macro and micro nutrients to the Nutrients table
   */
  async seedNutrients() {
    const { vitamins, minerals, macros, other } = nutrients;
    const allNutrients = [...vitamins, ...minerals, ...macros, ...other];
    // Replace eNum types
    allNutrients.map((nutrient: any) => {
      nutrient.category = NutrientCategory[nutrient.category.toUpperCase()];
      if (nutrient.solubility)
        nutrient.solubility =
          VitaminSolubility[nutrient.solubility.toUpperCase()];
    });
    // Upsert into database
    allNutrients.forEach(async (nutrient: any) => {
      await this.upsert(nutrient);
    });
  }
  async upsertNutrientRequirement(
    createNutrientRequirementDto: CreateNutrientRequirementDto,
  ) {
    const { nutrientName, ...createRequirement } = createNutrientRequirementDto;
    const nutrient: Nutrient = await this.findOneByName(nutrientName);
    return await this.prisma.nutrientRequirement.upsert({
      where: {
        standardName_yearFrom_nutrientId_biologicalSex: {
          nutrientId: nutrient.id,
          standardName: createNutrientRequirementDto.standardName,
          yearFrom: createNutrientRequirementDto.yearFrom,
          biologicalSex: createNutrientRequirementDto.biologicalSex,
        },
      },
      update: createRequirement,
      create: {
        ...createRequirement,
        nutrient: { connect: { id: nutrient.id } },
      },
    });
  }
  /**
   * Function that adds UK nutrition requirements from the British Nutrition Foundation
   */
  async seedUKNutrientRequirements() {
    // Map the data from the JSON to match the DTO so we can call upsert with it
    UKNutrientRequirements.map((requirement: any) => {
      requirement.biologicalSex =
        BioSex[requirement?.biologicalSex.toUpperCase()];
      requirement.nutrientName = requirement.name;
      delete requirement.name;
    });
    // For each mapped requirement, call upsert
    UKNutrientRequirements.forEach(async (requirement: any) => {
      await this.upsertNutrientRequirement(requirement);
    });
  }

  /**
   * Find the requirements for each nutrient in our database given a biological sex
   * @param bioSex
   */
  async findRequirements(bioSex: string) {
    let bioSexEnum = BioSex.FEMALE as BioSex;
    if (bioSex.toUpperCase() === 'MALE') bioSexEnum = BioSex.MALE;
    return await this.prisma.nutrient.findMany({
      include: {
        NutrientRequirements: {
          include: { nutrient: true },
          where: { biologicalSex: bioSexEnum },
        },
      },
      where: {
        NutrientRequirements: {
          some: {},
        },
      },
    });
  }
}
