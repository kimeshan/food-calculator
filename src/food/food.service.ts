import { Injectable } from '@nestjs/common';
import axios from 'axios';

import { CreateFoodDto } from './dto/create-food.dto';
import { UpdateFoodDto } from './dto/update-food.dto';
import { PrismaService } from 'nestjs-prisma';
import { DerivationMethodology, FoodNutrientSource } from '@prisma/client';
import { NutrientService } from '../nutrient/nutrient.service';

@Injectable()
export class FoodService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly nutrientService: NutrientService,
  ) {}
  create(createFoodDto: CreateFoodDto) {
    return this.prisma.food.create({ data: createFoodDto });
  }

  upsert(createFoodDto: CreateFoodDto) {
    return this.prisma.food.upsert({
      where: {
        name_source: { name: createFoodDto.name, source: createFoodDto.source },
      },
      update: {},
      create: createFoodDto,
    });
  }

  findAll() {
    return this.prisma.food.findMany();
  }

  update(id: number, updateFoodDto: UpdateFoodDto) {
    return this.prisma.food.update({
      where: { id },
      data: updateFoodDto,
    });
  }

  remove(id: number) {
    return this.prisma.food.delete({ where: { id } });
  }
  async getUSDAFoods(pageNumber = 1, dataType = 'Foundation') {
    const endpoint = 'https://api.nal.usda.gov/fdc/v1/foods/list';
    const apiKey = process.env.USDA_API_KEY;
    const request = `${endpoint}?api_key=${apiKey}&dataType=${dataType}&pageNumber=${pageNumber}`;
    const response = await axios.get(request);
    return response?.data;
  }

  async getUSDANutritionInfo(foodId: string) {
    // Get the USDA nutritional info for a foodId
    const endpoint = 'https://api.nal.usda.gov/fdc/v1/food/';
    const apiKey = process.env.USDA_API_KEY;
    const response = await axios.get(`${endpoint}${foodId}?api_key=${apiKey}`);

    // const { description, foodNutrients } = nutritionInfo?.data;
    return response?.data;
  }

  mapUSDAFoodNutrientToFoodNutrient(food, usdaFoodInfo: any) {
    // Nutrient Mapping
    const nutrientMapping = {
      'Calcium, Ca': 'Calcium',
      'Chromium, Cr': 'Chromium',
      'Chloride, Cl': 'Chloride',
      'Copper, Cu': 'Copper',
      'Iodine, I': 'Iodine',
      'Iron, Fe': 'Iron',
      'Magnesium, Mg': 'Magnesium',
      'Manganese, Mn': 'Manganese',
      'Molybdenum, Mo': 'Molybdenum',
      'Phosphorus, P': 'Phosphorus',
      'Potassium, K': 'Potassium',
      'Selenium, Se': 'Selenium',
      'Sodium, Na': 'Sodium',
      'Zinc, Zn': 'Zinc',
      'Vitamin A, RAE': 'Vitamin A',
      'Vitamin B-6': 'Vitamin B6',
      'Vitamin B-12': 'Vitamin B12',
      'Vitamin C, total ascorbic acid': 'Vitamin C',
      'Vitamin D (D2 + D3)': 'Vitamin D',
      'Vitamin D3 (cholecalciferol)': 'Vitamin D3',
      'Vitamin E (alpha-tocopherol)': 'Vitamin E',
      'Vitamin K (phylloquinone)': 'Vitamin K',
      Thiamin: 'Vitamin B1',
      Riboflavin: 'Vitamin B2',
      Niacin: 'Vitamin B3',
      'Pantothenic acid': 'Vitamin B5',
      Biotin: 'Vitamin B7',
      'Folate, total': 'Vitamin B9',
      'Folic acid': 'Vitamin B9',
      'Folate, DFE': 'Vitamin B9',
      Retinol: 'Vitamin A',
      'Vitamin D2 (ergocalciferol)': 'Vitamin D2',
      'Beta-sitosterol': 'Beta-sitosterol',
      Caffeine: 'Caffeine',
      'Choline, total': 'Choline',
      'Carbohydrate, by difference': 'Carbohydrates',
      Energy: 'Calories',
      'Fiber, total dietary': 'Dietary Fiber',
      'Lipids (fat)': 'Fats',
      Protein: 'Protein',
      'Sugars, total including NLEA': 'Sugars',
    };
    const unitNameToMigroMgMapping = {
      g: 1000000,
      mg: 1000,
      µg: 1,
    };
    const derivationMethodologyMapping = {
      Analytical: DerivationMethodology.ANALYTICAL,
      Calculated: DerivationMethodology.CALCULATED,
    };
    const foodNutrients = usdaFoodInfo.foodNutrients;
    foodNutrients.forEach(async (foodNutrient: any) => {
      const nutrientName: string = nutrientMapping[foodNutrient.nutrient.name];
      // If we have a mapping for this nutrient, let's add it to the foodNutrient database
      if (nutrientName) {
        // Find the nutrient in our database
        const nutrientRecord = await this.nutrientService.findOneByName(
          nutrientName,
        );
        // Concert the amount to micrograms
        const amountMicroMg =
          foodNutrient.amount *
          unitNameToMigroMgMapping[foodNutrient.nutrient.unitName];
        // Map the derivation methodology
        const derivationMethodology =
          derivationMethodologyMapping[
            foodNutrient.foodNutrientDerivation.description
          ];
        // Call the nutrient service to create the foodNutrient
        await this.nutrientService.upsertFoodNutrient(
          nutrientRecord.id,
          food.id,
          amountMicroMg,
          derivationMethodology,
          FoodNutrientSource.USDA,
          'https://fdc.nal.usda.gov/',
          foodNutrient.minYearAcquired,
        );
      }
    });

    // Convert all amounts into micrograms and derivationMethods to enums
  }

  async seedUSDAFoods(foodType = 'Foundation') {
    // First let's get all foundation foods
    let foodsFetched = [];
    let allFoods = [];
    let pageNumber = 1;
    do {
      foodsFetched = await this.getUSDAFoods(pageNumber, foodType);
      allFoods = [...allFoods, ...foodsFetched];
      pageNumber += 1;
    } while (foodsFetched && foodsFetched.length > 0);
    // Now for each food, le'ts get the nutrition info
    allFoods.forEach(async (food: any) => {
      const foodInfo = await this.getUSDANutritionInfo(food.fdcId);
      // Get kcal if available
      const kcalObject = foodInfo.foodNutrients.find(
        (foodNutrient: any) => foodNutrient.unitName.toUpperCase() === 'KCAL',
      );
      const createdFood = await this.upsert({
        name: food.description,
        description: food.description,
        numberOfGrams: 100,
        source: FoodNutrientSource.USDA,
        sourceRefId: food.fdcId,
        category: food.foodCategory.description,
        publicationDate: new Date(food.publicationDate),
        kcal: kcalObject ? kcalObject.amount : null,
      });
      // Now let's create the food nutrients:
      await this.mapUSDAFoodNutrientToFoodNutrient(createdFood, foodInfo);
    });
  }
}
