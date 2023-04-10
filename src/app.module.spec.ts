import { Test } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { AppModule } from './app.module';
import { AppService } from './app.service';
import { FoodModule } from './food/food.module';
import { NutrientModule } from './nutrient/nutrient.module';
import { PrismaService } from 'nestjs-prisma';

describe('AppModule', () => {
  let appService: AppService;
  let prismaService: PrismaService;

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      imports: [ConfigModule.forRoot(), AppModule, FoodModule, NutrientModule],
    }).compile();

    appService = app.get<AppService>(AppService);
    prismaService = app.get<PrismaService>(PrismaService);
  });

  afterAll(async () => {
    await prismaService.$disconnect();
  });

  describe('AppService', () => {
    it('should be defined', () => {
      expect(appService).toBeDefined();
    });
  });
});
