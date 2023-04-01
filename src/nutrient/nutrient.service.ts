import { Injectable, Param, ParseIntPipe } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateNutrientDto } from './dto/create-nutrient.dto';
import { UpdateNutrientDto } from './dto/update-nutrient.dto';

@Injectable()
export class NutrientService {
  constructor(private readonly prisma: PrismaService) {}
  create(createNutrientDto: CreateNutrientDto) {
    return this.prisma.nutrient.create({ data: createNutrientDto });
  }

  upsert(createNutrientDto: CreateNutrientDto) {
    return this.prisma.nutrient.upsert({
      where: { name: createNutrientDto?.name },
      update: {},
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
}
