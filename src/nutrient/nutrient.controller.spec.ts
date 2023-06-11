import { Test, TestingModule } from '@nestjs/testing';
import { Nutrient, NutrientCategory, VitaminSolubility } from '@prisma/client';
import { NutrientController } from './nutrient.controller';
import { NutrientService } from './nutrient.service';

describe('NutrientController', () => {
  let controller: NutrientController;
  let service: NutrientService;
  const mockedNutrientService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };
  beforeEach(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      controllers: [NutrientController],
      providers: [NutrientService],
    })
      .overrideProvider(NutrientService)
      .useValue(mockedNutrientService)
      .compile();

    controller = testingModule.get<NutrientController>(NutrientController);
    service = testingModule.get<NutrientService>(NutrientService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should call nutrientService.findAll', async () => {
      const nutrients: Nutrient[] = [
        {
          id: 1,
          name: 'Vitamin A',
          description: 'Vitamin A is important for vision.',
          category: NutrientCategory.VITAMIN,
          commonName: 'Vitamin A',
          solubility: VitaminSolubility.FAT,
        },
      ];

      service.findAll = jest.fn().mockResolvedValue(nutrients);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual(nutrients);
    });
  });

  describe('findOne', () => {
    it('should call nutrientService.findOne with correct id', async () => {
      const nutrient: Nutrient = {
        id: 1,
        name: 'Vitamin A',
        description: 'Vitamin A is important for vision.',
        category: NutrientCategory.VITAMIN,
        commonName: 'Vitamin A',
        solubility: VitaminSolubility.FAT,
      };

      service.findOne = jest.fn().mockResolvedValue(nutrient);

      const result = await controller.findOne(1);

      expect(service.findOne).toHaveBeenCalledTimes(1);
      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(nutrient);
    });
  });
});
