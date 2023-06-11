import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { NutrientService } from './nutrient.service';
import { ApiTags } from '@nestjs/swagger';
import seed from '../../prisma/seed';

@Controller('nutrient')
@ApiTags('nutrient')
export class NutrientController {
  constructor(private readonly nutrientService: NutrientService) {}

  @Get('seed')
  async seedDatabase() {
    await seed();
    return 'Database seed ran';
  }

  @Get('requirement/:sex')
  findRequirements(@Param('sex') bioSex: string) {
    return this.nutrientService.findRequirements(bioSex);
  }

  @Get()
  findAll() {
    return this.nutrientService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.nutrientService.findOne(id);
  }
}
