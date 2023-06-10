import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { NutrientService } from './nutrient.service';
import { CreateNutrientDto } from './dto/create-nutrient.dto';
import { UpdateNutrientDto } from './dto/update-nutrient.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('nutrient')
@ApiTags('nutrient')
export class NutrientController {
  constructor(private readonly nutrientService: NutrientService) {}

  @Post()
  create(@Body() createNutrientDto: CreateNutrientDto) {
    return this.nutrientService.create(createNutrientDto);
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

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateNutrientDto: UpdateNutrientDto,
  ) {
    return this.nutrientService.update(id, updateNutrientDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.nutrientService.remove(id);
  }
}
