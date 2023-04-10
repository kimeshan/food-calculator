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

  async getUSDANutritionInfo(foodId: string, format = 'full') {
    // Get the USDA nutritional info for a foodId
    const endpoint = 'https://api.nal.usda.gov/fdc/v1/food/';
    const apiKey = process.env.USDA_API_KEY;
    const response = await axios.get(
      `${endpoint}${foodId}?api_key=${apiKey}&format=${format}`,
    );

    // const { description, foodNutrients } = nutritionInfo?.data;
    return response?.data;
  }

  async mapUSDAFoodNutrientToFoodNutrient(food, usdaFoodInfo: any) {
    // Nutrient Mapping
    const nutrientMapping = {
      'Calcium, Ca': 'Calcium',
      'Carbohydrate, by difference': 'Carbohydrates',
      'Chloride, Cl': 'Chloride',
      'Choline, total': 'Choline',
      'Chromium, Cr': 'Chromium',
      'Copper, Cu': 'Copper',
      'Fiber, total dietary': 'Dietary Fiber',
      'Lipids (fat)': 'Fats',
      'Iodine, I': 'Iodine',
      'Iron, Fe': 'Iron',
      'Magnesium, Mg': 'Magnesium',
      'Manganese, Mn': 'Manganese',
      'Molybdenum, Mo': 'Molybdenum',
      'Phosphorus, P': 'Phosphorus',
      'Potassium, K': 'Potassium',
      Protein: 'Protein',
      'Selenium, Se': 'Selenium',
      'Sodium, Na': 'Sodium',
      Retinol: 'Vitamin A',
      Thiamin: 'Vitamin B1',
      Riboflavin: 'Vitamin B2',
      Niacin: 'Vitamin B3',
      'Pantothenic acid': 'Vitamin B5',
      'Vitamin B-6': 'Vitamin B6',
      Biotin: 'Vitamin B7',
      'Folate, total': 'Vitamin B9',
      'Vitamin B-12': 'Vitamin B12',
      'Vitamin C, total ascorbic acid': 'Vitamin C',
      'Vitamin D (D2 + D3)': 'Vitamin D',
      'Vitamin D2 (ergocalciferol)': 'Vitamin D2',
      'Vitamin D3 (cholecalciferol)': 'Vitamin D3',
      'Vitamin E (alpha-tocopherol)': 'Vitamin E',
      'Vitamin K (phylloquinone)': 'Vitamin K',
      'Zinc, Zn': 'Zinc',
    };

    const unitNameToMigroMgMapping = {
      g: 1000000,
      mg: 1000,
      µg: 1,
      ug: 1,
    };
    const derivationMethodologyMapping = {
      analytical: DerivationMethodology.ANALYTICAL,
      calculated: DerivationMethodology.CALCULATED,
    };
    const foodNutrients = usdaFoodInfo.foodNutrients;
    console.log('Mapping all food nutrients for: ', food.name, '');
    await foodNutrients.forEach(async (foodNutrient: any) => {
      const nutrientName: string = nutrientMapping[foodNutrient.name];
      // If we have a mapping for this nutrient, let's add it to the foodNutrient database
      if (nutrientName !== undefined) {
        // Find the nutrient in our database
        const nutrientRecord = await this.nutrientService.findOneByName(
          nutrientName,
        );
        // Concert the amount to micrograms
        const amountMicroMg =
          foodNutrient.amount *
          unitNameToMigroMgMapping[foodNutrient?.unitName?.toLowerCase()];
        // Map the derivation methodology
        const derivationMethodology =
          derivationMethodologyMapping[
            foodNutrient?.derivationDescription?.toLowerCase()
          ] || DerivationMethodology.UNKNOWN;
        console.log(
          `Create food nutrient record for ${nutrientRecord.name} with amount ${amountMicroMg} and derivation methodology ${derivationMethodology}`,
        );
        // Call the nutrient service to create the foodNutrient
        await this.nutrientService.upsertFoodNutrient(
          nutrientRecord.id,
          food.id,
          amountMicroMg,
          derivationMethodology,
          FoodNutrientSource.USDA,
          'https://fdc.nal.usda.gov/',
        );
      }
    });
  }

  async seedUSDAFoods(foodType = 'Foundation') {
    // First let's get all foundation foods
    let foodsFetched = [];
    let allFoods = [];
    let pageNumber = 1;
    console.log('Fetching all foundation foods...');
    do {
      foodsFetched = await this.getUSDAFoods(pageNumber, foodType);
      if (foodsFetched && foodsFetched.length > 0)
        allFoods = [...allFoods, ...foodsFetched];
      pageNumber += 1;
    } while (foodsFetched && foodsFetched.length > 0);
    console.log(
      `Successfully fetched ${allFoods.length} foundation foods. Proceeding to get nutrition info for each one..`,
    );
    // Now for each food, le'ts get the nutrition info
    allFoods.forEach(async (food: any) => {
      console.log('Fetching nutrition info for food: ' + food.description);
      const foodInfo = await this.getUSDANutritionInfo(food.fdcId, 'abridged');
      // Get kcal if available
      const kcalObject = food.foodNutrients.find(
        (foodNutrient: any) => foodNutrient?.unitName?.toUpperCase() === 'KCAL',
      );
      const kcal = kcalObject ? kcalObject.amount : null;
      const createdFood = await this.upsert({
        name: food.description,
        description: food.description,
        numberOfGrams: 100,
        source: FoodNutrientSource.USDA,
        sourceRefId: food.fdcId + '',
        category: food?.foodCategory?.description,
        publicationDate: new Date(food.publicationDate),
        kcal,
      });
      console.log('Successfully created food: ' + createdFood.name);
      // Now let's create the food nutrients:
      await this.mapUSDAFoodNutrientToFoodNutrient(createdFood, foodInfo);
    });
  }
}
