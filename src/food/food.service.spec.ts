import { Test, TestingModule } from '@nestjs/testing';
import { FoodService } from './food.service';

describe('FoodService', () => {
  let service: FoodService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FoodService],
    }).compile();

    service = module.get<FoodService>(FoodService);
  });

  it('should get USDA foods', async () => {
    // TO ADD WHEN API WORKING
    await service.getUSDAFoods();
  });
});
