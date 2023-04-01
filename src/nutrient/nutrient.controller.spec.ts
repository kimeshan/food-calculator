import { Test, TestingModule } from '@nestjs/testing';
import { Nutrient, NutrientCategory, VitaminSolubility } from '@prisma/client';
import { CreateNutrientDto } from './dto/create-nutrient.dto';
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

  describe('create', () => {
    it('should call nutrientService.create when creating a farm', async () => {
      const createNutrientDto: CreateNutrientDto = {
        name: 'name',
        description: 'description',
        category: NutrientCategory.VITAMIN,
      };

      (service.create as jest.Mock).mockResolvedValue({
        id: 1,
        ...createNutrientDto,
      });
      const result = await controller.create(createNutrientDto);
      expect(service.create).toHaveBeenCalledTimes(1);
      expect(service.create).toHaveBeenCalledWith(createNutrientDto);
      expect(result).toEqual({ id: 1, ...createNutrientDto });
    });
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

      const result = await controller.findOne('1');

      expect(service.findOne).toHaveBeenCalledTimes(1);
      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(nutrient);
    });
  });

  describe('update', () => {
    it('should call nutrientService.update with correct id and updateNutrientDto', async () => {
      const updateNutrientDto = {
        name: 'Vitamin A',
        description: 'Vitamin A is important for vision and immune function.',
        commonName: 'Vitamin A',
        solubility: VitaminSolubility.FAT,
      };

      const updatedNutrient: Nutrient = {
        id: 1,
        ...updateNutrientDto,
        category: NutrientCategory.VITAMIN,
      };

      service.update = jest.fn().mockResolvedValue(updatedNutrient);

      const result = await controller.update('1', updateNutrientDto);

      expect(service.update).toHaveBeenCalledTimes(1);
      expect(service.update).toHaveBeenCalledWith(1, updateNutrientDto);
      expect(result).toEqual(updatedNutrient);
    });
  });

  describe('remove', () => {
    it('should call nutrientService.remove with correct id', async () => {
      const nutrientId = 1;

      service.remove = jest.fn().mockResolvedValue({});

      await controller.remove('1');

      expect(service.remove).toHaveBeenCalledTimes(1);
      expect(service.remove).toHaveBeenCalledWith(nutrientId);
    });
  });
});
