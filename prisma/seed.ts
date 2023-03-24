import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();
const API_KEY = process.env.USDA_API_KEY;
const API_URL = 'https://api.nal.usda.gov/fdc/v1/';

async function seed() {}
/**
 * WARNING: THIS DELETES EVERYTHING FROM THE DATABASE
 */
async function clearDatabase() {
  console.log('Deleting all records');
  await prisma.nutrient.deleteMany();
  await prisma.food.deleteMany();
}
// Get all foundation foods
async function seedFoods(): Promise<any> {
  // Get all foods - NEED TO PAGE THROUGH RESULTS (210 FOUNDATION ITEMS)
  // USE &pageNumber=1
  const response = await axios.get(
    `${API_URL}foods/list?api_key=${API_KEY}&dataType=Foundation`,
  );

  const foods = response?.data;
  console.log(foods);

  // For each food, get the nutritional info
  for (const food of foods) {
    const foodId = food.fdcId;
    const nutritionInfo = await axios.get(
      `${API_URL}${foodId}?api_key=${API_KEY}`,
    );

    const { description, foodNutrients } = nutritionInfo?.data;

    const filteredNutrients = foodNutrients.filter(
      ({ amount }) => amount !== undefined,
    );

    const nutrients = filteredNutrients.map(
      ({ nutrient, foodNutrientDerivation, amount }) => ({
        name: nutrient?.name,
        amount,
        rank: nutrient?.rank,
        unit: nutrient?.unitName,
        derivedCode: foodNutrientDerivation?.code || 'Not stated',
        derivedDescription: foodNutrientDerivation?.description || 'Not stated',
      }),
    );

    //Add it to our database
    // Change to upsert
    // await prisma.food.create({
    //   data: {
    //     name: description,
    //     nutrients: {
    //       create: nutrients,
    //     },
    //   },
    // });
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
