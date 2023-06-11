import { Controller, Get } from '@nestjs/common';
import { FoodService } from './food.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('food')
@ApiTags('food')
export class FoodController {
  constructor(private readonly foodService: FoodService) {}
  @Get()
  findAll() {
    return this.foodService.findAll();
  }
}
