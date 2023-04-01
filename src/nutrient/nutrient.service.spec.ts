import { Test } from '@nestjs/testing';
import { BioSex, Nutrient } from '@prisma/client';
import { PrismaModule, PrismaService } from 'nestjs-prisma';
import {
  createNutrientDto,
  createNutrientRequirementDto,
} from '../../prisma/data.factory';
import { prismaMock } from '../../prisma/testing/singleton';
import { NutrientController } from './nutrient.controller';
import { NutrientService } from './nutrient.service';
import * as seedNutrients from '../../prisma/seed_data/nutrients.json';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as UKNutrientRequirements from '../../prisma/seed_data/uk_nutrition_req.json';

// Replace the real UKNutrientRequirements with the mock data
jest.mock('../../prisma/seed_data/uk_nutrition_req.json', () => {
  const sampleRawDataObject = {
    name: 'Vitamin A',
    standardName: 'Dietary Reference Values UK',
    sourceURL: 'nutrition.com',
    yearFrom: 2021,
    ageGroupStart: 228,
    ageGroupEnd: 600,
    amountMicroMg: 700,
    biologicalSex: 'male',
    source: 'British Nutrition Foundation',
  };
  return [sampleRawDataObject];
});

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
  it(`upsert should call nutrient.upsert in Prisma`, async () => {
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

  it(`findAll should call nutrient.findMany in Prisma`, async () => {
    const nutrients: Nutrient[] = [{ id: 111, ...createNutrientDto }];
    prismaMock.nutrient.findMany.mockResolvedValue(nutrients);
    const result = await service.findAll();
    expect(prismaMock.nutrient.findMany.mock.calls).toHaveLength(1);
    expect(prismaMock.nutrient.findMany.mock.calls[0][0]).toStrictEqual(
      undefined,
    );
    expect(result).toEqual(nutrients);
  });
  it(`findOne should call nutrient.findUnique in Prisma`, async () => {
    const nutrient = { id: 111, ...createNutrientDto };
    prismaMock.nutrient.findUnique.mockResolvedValue(nutrient);
    const result = await service.findOne(111);
    expect(prismaMock.nutrient.findUnique.mock.calls).toHaveLength(1);
    expect(prismaMock.nutrient.findUnique.mock.calls[0][0]).toStrictEqual({
      where: { id: 111 },
    });
    expect(result).toEqual(nutrient);
  });
  it(`findOneByName should call nutrient.findUnique in Prisma`, async () => {
    const nutrient = { id: 111, ...createNutrientDto };
    prismaMock.nutrient.findUnique.mockResolvedValue(nutrient);
    const result = await service.findOneByName(createNutrientDto.name);
    expect(prismaMock.nutrient.findUnique.mock.calls).toHaveLength(1);
    expect(prismaMock.nutrient.findUnique.mock.calls[0][0]).toStrictEqual({
      where: { name: createNutrientDto.name },
    });
    expect(result).toEqual(nutrient);
  });
  it(`update should call nutrient.update in Prisma`, async () => {
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
  it(`remove should call nutrient.delete in Prisma`, async () => {
    const nutrient = { id: 111, ...createNutrientDto };
    prismaMock.nutrient.delete.mockResolvedValue(nutrient);
    const result = await service.remove(111);
    expect(prismaMock.nutrient.delete.mock.calls).toHaveLength(1);
    expect(prismaMock.nutrient.delete.mock.calls[0][0]).toStrictEqual({
      where: { id: 111 },
    });
    expect(result).toEqual(nutrient);
  });
  it(`seeds all nutrients correctly`, async () => {
    // TODO: Refactor this so that it uses a sample data point like seed UKNutrientRequirements test
    const { vitamins, minerals, macros, other } = seedNutrients;
    const allSeedNutrients = [...vitamins, ...minerals, ...macros, ...other];
    const mockUpsert = jest.fn();
    const mockClassInstance = { upsert: mockUpsert };
    await service.seedNutrients.call(mockClassInstance);
    expect(mockUpsert).toHaveBeenCalledTimes(allSeedNutrients.length);
  });
  it(`upsertNutrientRequirement should call nutrientRequirement.upsert in Prisma`, async () => {
    // Mock findOneByName
    const findOneByName = jest.fn();
    const mockClassInstance = { findOneByName, prisma: prismaMock };
    findOneByName.mockResolvedValue({ id: 300 });

    // Mock result (resolved value) of upsert
    const nutrientReq = { id: 200, ...createNutrientRequirementDto };
    prismaMock.nutrientRequirement.upsert.mockResolvedValue(nutrientReq);

    // Call the service
    const result = await service.upsertNutrientRequirement.call(
      mockClassInstance,
      createNutrientRequirementDto,
    );

    // Assertions
    const createRequirement = { ...createNutrientRequirementDto };
    delete createRequirement.nutrientName;
    expect(prismaMock.nutrientRequirement.upsert.mock.calls).toHaveLength(1);
    expect(
      prismaMock.nutrientRequirement.upsert.mock.calls[0][0],
    ).toStrictEqual({
      where: {
        standardName_yearFrom_nutrientId_biologicalSex: {
          nutrientId: 300,
          standardName: nutrientReq.standardName,
          yearFrom: nutrientReq.yearFrom,
          biologicalSex: nutrientReq.biologicalSex,
        },
      },
      update: createRequirement,
      create: {
        ...createRequirement,
        nutrient: { connect: { id: 300 } },
      },
    });
    expect(result).toEqual(nutrientReq);
  });
  it(`seeds all UKNutrientRequirements correctly`, async () => {
    // Mock the upsertNutrientRequirement method
    const upsertNutrientRequirement = jest.fn();
    const mockClassInstance = { upsertNutrientRequirement };

    // Call the function with the mocked method
    await service.seedUKNutrientRequirements.call(mockClassInstance);

    // Assert that the upsert method was called with correct data shape object

    const expectedDataObject = {
      nutrientName: 'Vitamin A',
      standardName: 'Dietary Reference Values UK',
      sourceURL: 'nutrition.com',
      yearFrom: 2021,
      ageGroupStart: 228,
      ageGroupEnd: 600,
      amountMicroMg: 700,
      biologicalSex: BioSex.MALE,
      source: 'British Nutrition Foundation',
    };

    expect(upsertNutrientRequirement.mock.calls[0][0]).toStrictEqual(
      expectedDataObject,
    );
    expect(upsertNutrientRequirement).toHaveBeenCalledTimes(1);
  });
});
