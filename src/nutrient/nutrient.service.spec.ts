import { Test } from '@nestjs/testing';
import { Nutrient } from '@prisma/client';
import { PrismaModule, PrismaService } from 'nestjs-prisma';
import { createNutrientDto } from '../../prisma/data.factory';
import { prismaMock } from '../../prisma/testing/singleton';
import { NutrientController } from './nutrient.controller';
import { NutrientService } from './nutrient.service';
import * as seedNutrients from '../../prisma/seed_data/nutrients.json';

describe('NutrientService', () => {
  let service: NutrientService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [NutrientService, PrismaService],
      imports: [PrismaModule],
      controllers: [NutrientController],
    })
      .overrideProvider(PrismaService)
      .useValue(prismaMock)
      .compile();

    service = module.get(NutrientService);
  });

  it(`create should call nutrient.create in Prisma`, async () => {
    const nutrient = { id: 111, ...createNutrientDto };
    prismaMock.nutrient.create.mockResolvedValue(nutrient);
    const result = await service.create(createNutrientDto);
    expect(prismaMock.nutrient.create.mock.calls).toHaveLength(1);
    expect(prismaMock.nutrient.create.mock.calls[0][0]).toStrictEqual({
      data: createNutrientDto,
    });
    expect(result).toEqual(nutrient);
  });
  it(`create should call nutrient.upsert in Prisma`, async () => {
    const nutrient = { id: 111, ...createNutrientDto };
    prismaMock.nutrient.upsert.mockResolvedValue(nutrient);
    const result = await service.upsert(createNutrientDto);
    expect(prismaMock.nutrient.upsert.mock.calls).toHaveLength(1);
    expect(prismaMock.nutrient.upsert.mock.calls[0][0]).toStrictEqual({
      where: { name: createNutrientDto.name },
      update: createNutrientDto,
      create: createNutrientDto,
    });
    expect(result).toEqual(nutrient);
  });

  it(`create should call nutrient.findAll in Prisma`, async () => {
    const nutrients: Nutrient[] = [{ id: 111, ...createNutrientDto }];
    prismaMock.nutrient.findMany.mockResolvedValue(nutrients);
    const result = await service.findAll();
    expect(prismaMock.nutrient.findMany.mock.calls).toHaveLength(1);
    expect(prismaMock.nutrient.findMany.mock.calls[0][0]).toStrictEqual(
      undefined,
    );
    expect(result).toEqual(nutrients);
  });
  it(`create should call nutrient.findOne in Prisma`, async () => {
    const nutrient = { id: 111, ...createNutrientDto };
    prismaMock.nutrient.findUnique.mockResolvedValue(nutrient);
    const result = await service.findOne(111);
    expect(prismaMock.nutrient.findUnique.mock.calls).toHaveLength(1);
    expect(prismaMock.nutrient.findUnique.mock.calls[0][0]).toStrictEqual({
      where: { id: 111 },
    });
    expect(result).toEqual(nutrient);
  });
  it(`create should call nutrient.update in Prisma`, async () => {
    const nutrient = { id: 111, ...createNutrientDto };
    prismaMock.nutrient.update.mockResolvedValue(nutrient);
    const result = await service.update(111, createNutrientDto);
    expect(prismaMock.nutrient.update.mock.calls).toHaveLength(1);
    expect(prismaMock.nutrient.update.mock.calls[0][0]).toStrictEqual({
      where: { id: 111 },
      data: createNutrientDto,
    });
    expect(result).toEqual(nutrient);
  });
  it(`create should call nutrient.delete in Prisma`, async () => {
    const nutrient = { id: 111, ...createNutrientDto };
    prismaMock.nutrient.delete.mockResolvedValue(nutrient);
    const result = await service.remove(111);
    expect(prismaMock.nutrient.delete.mock.calls).toHaveLength(1);
    expect(prismaMock.nutrient.delete.mock.calls[0][0]).toStrictEqual({
      where: { id: 111 },
    });
    expect(result).toEqual(nutrient);
  });
  it(`it seeds all nutrients correctly`, async () => {
    const { vitamins, minerals, macros, other } = seedNutrients;
    const allSeedNutrients = [...vitamins, ...minerals, ...macros, ...other];
    const mockUpsert = jest.fn();
    const mockClassInstance = { upsert: mockUpsert };
    await service.seedNutrients.call(mockClassInstance);
    expect(mockUpsert).toHaveBeenCalledTimes(allSeedNutrients.length);
  });
});
