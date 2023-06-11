import { Test, TestingModule } from '@nestjs/testing';
import { FoodController } from './food.controller';
import { FoodService } from './food.service';
import { FoodSource } from '@prisma/client';

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
});
