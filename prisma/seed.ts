import { PrismaClient, FoodNutrientSource } from '@prisma/client';
import axios from 'axios';
import { PrismaService } from 'nestjs-prisma';
import configuration from '../config/configuration';
import { NutrientService } from '../src/nutrient/nutrient.service';

const prisma = new PrismaClient();
const prismaService = new PrismaService();
const API_KEY = process.env.USDA_API_KEY;
const API_URL = 'https://api.nal.usda.gov/fdc/v1/';

/**
 * Main Seed entry function
 */
async function seed() {
  const nutrientService = new NutrientService(prismaService);
  // Seed Nutrients
  await nutrientService.seedNutrients();
  // Seed different sets of Nutrient Requirements
  await nutrientService.seedUKNutrientRequirements();
  // Seed USDA Foods with their nutrition info
}

/**
 * WARNING: THIS DELETES EVERYTHING FROM THE DATABASE
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function clearDatabase() {
  // Only allow this code to run on local env
  const config = configuration();
  if (config.node_env === 'local') {
    console.log('Deleting all records');
    const tablenames = await prisma.$queryRaw<
      Array<{ tablename: string }>
    >`SELECT tablename FROM pg_tables WHERE schemaname='public'`;

    const tables = tablenames
      .map(({ tablename }) => tablename)
      .filter((name) => name !== '_prisma_migrations')
      .map((name) => `"public"."${name}"`)
      .join(', ');

    try {
      await prisma.$executeRawUnsafe(`TRUNCATE TABLE ${tables} CASCADE;`);
    } catch (error) {
      console.log({ error });
    }
  }
}
// Get all foundation foods
async function seedUSDAFoods(): Promise<any> {
  // Get all foods - NEED TO PAGE THROUGH RESULTS (210 FOUNDATION ITEMS)
  // USE &pageNumber=1
  const response = await axios.get(
    `${API_URL}foods/list?api_key=${API_KEY}&dataType=Foundation`,
  );

  const foods = response?.data.slice(0, 2);

  // For each food, get the nutritional info
  for (const food of foods) {
    const foodId = food.fdcId;
    const nutritionInfo = await axios.get(
      `${API_URL}${foodId}?api_key=${API_KEY}`,
    );
    const { description, foodNutrients } = nutritionInfo?.data;

    // Remove nutrients that are undefined
    const filteredNutrients = foodNutrients.filter(
      ({ amount }) => amount !== undefined,
    );
    console.log(description);
    // Add Food to database
    // const foodRecord = await prisma.food.upsert({
    //   where: { name: description },
    //   update: {},
    //   create: { name: description, numberOfGrams: 100 },
    // });

    // Nutrient Mapping
    const mapUSDAtoFoodNutrientModel = {
      Protein: 'Protein',
      'Carbohydrate, by difference': 'Carbohydrates',
      'Total lipid (fat)': 'Fats',
      'Fiber, total dietary': 'Dietary Fiber',
      'Calcium, Ca': 'Calcium',
      'Iron, Fe': 'Iron',
      'Magnesium, Mg': 'Magnesium',
      'Phosphorus, P': 'Phosphorus',
      'Potassium, K': 'Potassium',
      'Sodium, Na': 'Sodium',
      'Zinc, Zn': 'Zinc',
      'Copper, Cu': 'Copper',
      'Manganese, Mn': 'Manganese',
      Thiamin: 'Vitamin B1',
      Riboflavin: 'Vitamin B2',
      Niacin: 'Niacin',
      'Vitamin B-6': 'Vitamin B6',
      Biotin: 'Vitamin B7',
      'Folate, total': 'Vitamin B7',
      'Vitamin B-12': 'Vitamin B12',
      Retinol: 'Vitamin A',
      'Vitamin D (D2 + D3)': 'Vitamin D',
      'Vitamin D2 (ergocalciferol)': 'Vitamin D2',
      'Vitamin D3 (cholecalciferol)': 'Vitamin D3',
    };
    const source = FoodNutrientSource.USDA;
    filteredNutrients.forEach(async (nutritionData: any) => {
      const { nutrient, amount, foodNutrientDerivation } = nutritionData;
      if (mapUSDAtoFoodNutrientModel[nutrient?.name]) {
        // Find the nutrient in our database
        const nutrientRecord = await prisma.nutrient.findUnique({
          where: { name: mapUSDAtoFoodNutrientModel[nutrient.name] },
        });
        console.log(nutrient.name, amount, nutrient.unitName);

        // Convert all amounts into micrograms and derivationMethods to enums
        // Upsert Food Nutrient Record
        // await prisma.foodNutrient.upsert({
        //   where: { foodId_nutrientId_source : {
        //     foodId: foodRecord.id,
        //     nutrientId: nutrientRecord.id,
        //     source,
        //   }}
        //   update: {},
        //   create: {
        //     amountMicroMg: 1,
        //     derivationMethodology: 'xx',
        //     source,
        //     sourceUrl: "https://fdc.nal.usda.gov/",
        //     food: { connect: {id : foodRecord.id}},
        //     nutrient: { connect: {id : nutrientRecord.id}}
        //   },
        // });
      }
    });
  }
}

// Start database seeding
seed()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
