/*
  Warnings:

  - The values [macro] on the enum `NutrientCategory` will be removed. If these variants are still used in the database, this will fail.
  - A unique constraint covering the columns `[commonName]` on the table `Nutrient` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "NutrientCategory_new" AS ENUM ('macronutrient', 'micronutrient', 'vitamin', 'mineral');
ALTER TABLE "Nutrient" ALTER COLUMN "category" TYPE "NutrientCategory_new" USING ("category"::text::"NutrientCategory_new");
ALTER TYPE "NutrientCategory" RENAME TO "NutrientCategory_old";
ALTER TYPE "NutrientCategory_new" RENAME TO "NutrientCategory";
DROP TYPE "NutrientCategory_old";
COMMIT;

-- AlterTable
ALTER TABLE "Nutrient" ADD COLUMN     "commonName" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Nutrient_commonName_key" ON "Nutrient"("commonName");
