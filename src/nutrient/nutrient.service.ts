import { Injectable, Param, ParseIntPipe } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateNutrientDto } from './dto/create-nutrient.dto';
import { UpdateNutrientDto } from './dto/update-nutrient.dto';
import * as nutrients from '../../prisma/seed_data/nutrients.json';
import { NutrientCategory, VitaminSolubility } from '@prisma/client';

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

  findAll() {
    return this.prisma.nutrient.findMany();
  }

  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.prisma.nutrient.findUnique({ where: { id } });
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
}
