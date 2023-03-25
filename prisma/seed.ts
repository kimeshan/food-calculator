import {
  PrismaClient,
  Sex,
  NutrientCategory,
  VitaminSolubility,
  Nutrient,
} from '@prisma/client';
import axios from 'axios';
import * as nutrients from './seed_data/nutrients.json';
import * as UKNutrientRequirements from './seed_data/uk_nutrition_req.json';

const prisma = new PrismaClient();
const API_KEY = process.env.USDA_API_KEY;
const API_URL = 'https://api.nal.usda.gov/fdc/v1/';

async function seed() {
  seedNutrients();
  seedNutrientRequirements();
}

async function seedNutrients() {
  const { vitamins, minerals, macros, other } = nutrients;
  const allNutrients = [...vitamins, ...minerals, ...macros, ...other];
  // Replace eNum types
  allNutrients.map((nutrient: any) => {
    nutrient.category = NutrientCategory[nutrient.category];
    if (nutrient.solubility)
      nutrient.solubility = VitaminSolubility[nutrient?.solubility];
  });
  // Upsert into database
  allNutrients.forEach(async (nutrient: any) => {
    await prisma.nutrient.upsert({
      where: { name: nutrient?.name },
      update: {},
      create: nutrient,
    });
  });
}

async function seedNutrientRequirements() {
  // Replace string with enum types
  UKNutrientRequirements.map(
    (requirement: any) =>
      (requirement.biologicalSex = Sex[requirement?.biologicalSex]),
  );
  UKNutrientRequirements.forEach(async (requirement: any) => {
    const { name, ...createRequirement } = requirement;
    const nutrient: Nutrient = await prisma.nutrient.findUnique({
      where: { name },
    });
    await prisma.nutrientRequirement.upsert({
      where: {
        standardName_yearFrom_nutrientId_biologicalSex: {
          nutrientId: nutrient.id,
          standardName: requirement.standardName,
          yearFrom: requirement.yearFrom,
          biologicalSex: requirement.biologicalSex,
        },
      },
      update: {},
      create: {
        ...createRequirement,
        nutrient: { connect: { id: nutrient.id } },
      },
    });
  });
}
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
