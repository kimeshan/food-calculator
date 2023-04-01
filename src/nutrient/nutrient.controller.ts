import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { NutrientService } from './nutrient.service';
import { CreateNutrientDto } from './dto/create-nutrient.dto';
import { UpdateNutrientDto } from './dto/update-nutrient.dto';

@Controller('nutrient')
export class NutrientController {
  constructor(private readonly nutrientService: NutrientService) {}

  @Post()
  create(@Body() createNutrientDto: CreateNutrientDto) {
    return this.nutrientService.create(createNutrientDto);
  }

  @Get()
  findAll() {
    return this.nutrientService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.nutrientService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateNutrientDto: UpdateNutrientDto,
  ) {
    return this.nutrientService.update(+id, updateNutrientDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.nutrientService.remove(+id);
  }
}