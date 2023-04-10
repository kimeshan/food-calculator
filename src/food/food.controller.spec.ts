import { Test, TestingModule } from '@nestjs/testing';
import { FoodController } from './food.controller';
import { FoodService } from './food.service';
import { CreateFoodDto } from './dto/create-food.dto';
import { UpdateFoodDto } from './dto/update-food.dto';
import { Food, FoodSource } from '@prisma/client';

describe('FoodController', () => {
  let controller: FoodController;
  let service: FoodService;
  const mockedFoodService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FoodController],
      providers: [FoodService],
    })
      .overrideProvider(FoodService)
      .useValue(mockedFoodService)
      .compile();

    controller = module.get<FoodController>(FoodController);
    service = module.get<FoodService>(FoodService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should call foodService.create when creating a new food', async () => {
      const createFoodDto: CreateFoodDto = {
        name: 'Apple',
        numberOfGrams: 100,
        description: 'A red fruit',
        source: FoodSource.USDA,
        sourceRefId: '1234',
        category: 'Fruit',
      };
      (service.create as jest.Mock).mockResolvedValue({
        id: 1,
        ...createFoodDto,
      });
      const result = await controller.create(createFoodDto);
      expect(service.create).toHaveBeenCalledTimes(1);
      expect(service.create).toHaveBeenCalledWith(createFoodDto);
      expect(result).toEqual({ id: 1, ...createFoodDto });
    });
  });

  describe('findAll', () => {
    it('should call foodService.findAll', async () => {
      const foods = [
        {
          id: 1,
          name: 'Apple',
          numberOfGrams: 100,
          description: 'A red fruit',
          source: FoodSource.USDA,
        },
        {
          id: 2,
          name: 'Banana',
          numberOfGrams: 100,
          description: 'A yellow fruit',
          source: FoodSource.USDA,
        },
      ];

      (service.findAll as jest.Mock).mockResolvedValue(foods);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual(foods);
    });
  });

  describe('update', () => {
    it('should call foodService.update with correct id and updateFoodDto', async () => {
      const updateFoodDto: UpdateFoodDto = {
        name: 'Apple',
        numberOfGrams: 100,
        description: 'A red fruit',
        source: FoodSource.USDA,
      };

      const updatedFood = {
        id: 1,
        ...updateFoodDto,
      };

      (service.update as jest.Mock).mockResolvedValue(updatedFood);

      const result = await controller.update(1, updateFoodDto);

      expect(service.update).toHaveBeenCalledTimes(1);
      expect(service.update).toHaveBeenCalledWith(1, updateFoodDto);
      expect(result).toEqual(updatedFood);
    });
  });

  describe('delete', () => {
    it('should call foodService.remove with correct id', async () => {
      (service.remove as jest.Mock).mockResolvedValue({});

      await controller.remove(1);

      expect(service.remove).toHaveBeenCalledTimes(1);
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});
