import { Injectable } from '@nestjs/common';
import axios from 'axios';

import { CreateFoodDto } from './dto/create-food.dto';
import { UpdateFoodDto } from './dto/update-food.dto';

@Injectable()
export class FoodService {
  create(createFoodDto: CreateFoodDto) {
    return 'This action adds a new food';
  }

  findAll() {
    return `This action returns all food`;
  }

  update(id: number, updateFoodDto: UpdateFoodDto) {
    return `This action updates a #${id} food`;
  }

  remove(id: number) {
    return `This action removes a #${id} food`;
  }
}
