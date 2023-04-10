import { PrismaClient } from '@prisma/client';

import { PrismaService } from 'nestjs-prisma';
import configuration from '../config/configuration';
import { NutrientService } from '../src/nutrient/nutrient.service';
import { FoodService } from '../src/food/food.service';

const prisma = new PrismaClient();
const prismaService = new PrismaService();
/**
 * Main Seed entry function
 */
async function seed() {
  const nutrientService = new NutrientService(prismaService);
  const foodService = new FoodService(prismaService, nutrientService);
  // Seed Nutrients
  console.log('Seeding Nutrients...');
  await nutrientService.seedNutrients();
  // Seed different sets of Nutrient Requirements
  await new Promise((resolve) => setTimeout(resolve, 500));
  console.log('Seeding UK nutrient requirements...');
  await nutrientService.seedUKNutrientRequirements();
  // Seed USDA foundation foods
  await new Promise((resolve) => setTimeout(resolve, 500));
  await foodService.seedUSDAFoods('Foundation');
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
