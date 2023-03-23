import { Injectable } from '@nestjs/common';
import axios from 'axios';

import { CreateFoodDto } from './dto/create-food.dto';
import { UpdateFoodDto } from './dto/update-food.dto';

@Injectable()
export class FoodService {
  private readonly API_KEY = process.env.USDA_API_KEY;
  create(createFoodDto: CreateFoodDto) {
    return 'This action adds a new food';
  }

  findAll() {
    return `This action returns all food`;
  }

  findOne(id: number) {
    return `This action returns a #${id} food`;
  }

  update(id: number, updateFoodDto: UpdateFoodDto) {
    return `This action updates a #${id} food`;
  }

  remove(id: number) {
    return `This action removes a #${id} food`;
  }

  async getNutritionInfo(foodName: string): Promise<any> {
    const response = await axios.get(
      `https://api.nal.usda.gov/fdc/v1/search?api_key=${this.API_KEY}&generalSearchInput=${foodName}`
    );

    const foodId = response?.data?.foods?.[0]?.fdcId;

    if (!foodId) {
      throw new Error(`No nutrition information found for ${foodName}`);
    }

    const nutritionInfo = await axios.get(
      `https://api.nal.usda.gov/fdc/v1/${foodId}?api_key=${this.API_KEY}`
    );
    console.log(nutritionInfo);
    return nutritionInfo?.data?.foodNutrients;
  }
}
