import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule, PrismaService } from 'nestjs-prisma';
import { FoodService } from './food.service';
import { NutrientService } from '../nutrient/nutrient.service';
import { CreateFoodDto } from './dto/create-food.dto';
import { UpdateFoodDto } from './dto/update-food.dto';
import {
  DerivationMethodology,
  FoodNutrientSource,
  FoodSource,
  NutrientCategory,
  VitaminSolubility,
} from '@prisma/client';
import { FoodController } from './food.controller';
import { prismaMock } from '../../prisma/testing/singleton';
import axios from 'axios';

describe('FoodService', () => {
  let foodService: FoodService;
  let nutrientService: NutrientService;
  let axiosGetSpy: jest.SpyInstance;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FoodService,
        PrismaService,
        {
          provide: NutrientService,
          useValue: {
            findOneByName: jest.fn(),
            upsertFoodNutrient: jest.fn(),
          },
        },
      ],
      imports: [PrismaModule],
      controllers: [FoodController],
    })
      .overrideProvider(PrismaService)
      .useValue(prismaMock)
      .compile();

    foodService = module.get<FoodService>(FoodService);
    nutrientService = module.get<NutrientService>(NutrientService);
  });

  describe('create', () => {
    it('should create a food record', async () => {
      const food: CreateFoodDto = {
        name: 'Apple',
        description: 'A delicious fruit',
        numberOfGrams: 100,
        source: FoodSource.USDA,
        sourceRefId: null,
      };

      const createdFood = {
        id: 1,
        ...food,
        createdAt: new Date(),
      };

      prismaMock.food.create.mockResolvedValue(createdFood);

      const result = await foodService.create(food);
      expect(prismaMock.food.create.mock.calls).toHaveLength(1);
      expect(prismaMock.food.create).toHaveBeenCalledWith({ data: food });
      expect(result).toEqual(createdFood);
    });
  });

  describe('upsert', () => {
    it('should upsert a food record', async () => {
      const food: CreateFoodDto = {
        name: 'Apple',
        description: 'A delicious fruit',
        numberOfGrams: 100,
        source: FoodSource.USDA,
      };

      const upsertedFood = {
        id: 1,
        ...food,
      };

      prismaMock.food.upsert.mockResolvedValue(upsertedFood);

      const result = await foodService.upsert(food);

      expect(prismaMock.food.upsert).toHaveBeenCalledWith({
        where: { name_source: { name: food.name, source: food.source } },
        update: {},
        create: food,
      });
      expect(result).toEqual(upsertedFood);
    });
  });
  describe('findAll', () => {
    it('should return all food records', async () => {
      const foodList = [
        {
          id: 1,
          name: 'Apple',
          description: 'A delicious fruit',
          numberOfGrams: 100,
          source: FoodSource.USDA,
          sourceRefId: null,
          createdAt: new Date(),
          kcal: 52.0,
        },
        {
          id: 2,
          name: 'Banana',
          description: 'A yellow fruit',
          numberOfGrams: 100,
          source: FoodSource.USDA,
          sourceRefId: null,
          createdAt: new Date(),
          kcal: 89.0,
        },
      ];

      prismaMock.food.findMany.mockResolvedValue(foodList);

      const result = await foodService.findAll();
      expect(prismaMock.food.findMany.mock.calls).toHaveLength(1);
      expect(result).toEqual(foodList);
    });
  });
  describe('update', () => {
    it('should update a food record', async () => {
      const id = 1;
      const updateFoodDto: UpdateFoodDto = {
        name: 'Updated Apple',
        description: 'An updated delicious fruit',
        numberOfGrams: 200,
        source: FoodSource.USDA,
        sourceRefId: null,
      };

      const updatedFood = {
        id,
        ...updateFoodDto,
        createdAt: new Date(),
      };

      prismaMock.food.update.mockResolvedValue(updatedFood);

      const result = await foodService.update(id, updateFoodDto);

      expect(prismaMock.food.update.mock.calls).toHaveLength(1);
      expect(prismaMock.food.update).toHaveBeenCalledWith({
        where: { id },
        data: updateFoodDto,
      });
      expect(result).toEqual(updatedFood);
    });
  });
  describe('remove', () => {
    it('should remove a food record', async () => {
      const foodId = 1;

      prismaMock.food.delete.mockResolvedValue({ id: foodId });

      const result = await foodService.remove(foodId);
      expect(prismaMock.food.delete.mock.calls).toHaveLength(1);
      expect(prismaMock.food.delete).toHaveBeenCalledWith({
        where: { id: foodId },
      });
      expect(result).toEqual({ id: foodId });
    });
  });
  describe('getUSDAFoods', () => {
    it('should make a GET request to the USDA API with correct query parameters', async () => {
      const pageNumber = 1;
      const dataType = 'Foundation';
      const mockData = { mock: 'data' };
      axiosGetSpy = jest
        .spyOn(axios, 'get')
        .mockResolvedValueOnce({ data: mockData });

      const result = await foodService.getUSDAFoods(pageNumber, dataType);

      expect(axiosGetSpy).toHaveBeenCalledWith(
        `https://api.nal.usda.gov/fdc/v1/foods/list?api_key=${process.env.USDA_API_KEY}&dataType=${dataType}&pageNumber=${pageNumber}`,
      );
      expect(result).toEqual(mockData);
    });
  });

  describe('getUSDANutritionInfo', () => {
    it('should make a GET request to the USDA API with correct query parameters', async () => {
      const foodId = '12345';
      const format = 'full';
      const mockData = { mock: 'data' };
      axiosGetSpy = jest
        .spyOn(axios, 'get')
        .mockResolvedValueOnce({ data: mockData });

      const result = await foodService.getUSDANutritionInfo(foodId, format);

      expect(axiosGetSpy).toHaveBeenCalledWith(
        `https://api.nal.usda.gov/fdc/v1/food/${foodId}?api_key=${process.env.USDA_API_KEY}&format=${format}`,
      );
      expect(result).toEqual(mockData);
    });
    it('maps USDA food nutrient to food nutrient', async () => {
      const food = { id: 1, name: 'Apple' };
      const usdaFoodInfo = {
        foodNutrients: [
          { name: 'Calcium, Ca', amount: 50, unitName: 'mg' },
          { name: 'Carbohydrate, by difference', amount: 13, unitName: 'g' },
        ],
      };

      const nutrientRecord = {
        id: 1,
        name: 'Calcium',
        commonName: 'Calcium',
        description: '',
        category: NutrientCategory.MINERAL,
        solubility: VitaminSolubility.FAT,
      };

      const nutrientRecord2 = {
        id: 2,
        name: 'Carbohydrates',
        commonName: '',
        description: '',
        category: '',
        solubility: '',
      };
      (nutrientService.findOneByName as jest.Mock)
        .mockReturnValueOnce(nutrientRecord)
        .mockReturnValueOnce(nutrientRecord2);

      await foodService.mapUSDAFoodNutrientToFoodNutrient(food, usdaFoodInfo);

      expect(nutrientService.findOneByName).toHaveBeenCalledTimes(2);
      expect(nutrientService.upsertFoodNutrient).toHaveBeenCalledTimes(2);
      expect(nutrientService.upsertFoodNutrient).toHaveBeenCalledWith(
        nutrientRecord.id,
        food.id,
        50000,
        DerivationMethodology.UNKNOWN,
        FoodNutrientSource.USDA,
        'https://fdc.nal.usda.gov/',
      );
    });
  });
});
