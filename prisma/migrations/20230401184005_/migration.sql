/*
  Warnings:

  - The values [analytical,calculated] on the enum `DerivationMethodology` will be removed. If these variants are still used in the database, this will fail.
  - The values [macronutrient,micronutrient,vitamin,mineral] on the enum `NutrientCategory` will be removed. If these variants are still used in the database, this will fail.
  - The values [fat,water] on the enum `VitaminSolubility` will be removed. If these variants are still used in the database, this will fail.
  - The `biologicalSex` column on the `NutrientRequirement` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "BioSex" AS ENUM ('MALE', 'FEMALE');

-- AlterEnum
BEGIN;
CREATE TYPE "DerivationMethodology_new" AS ENUM ('ANALYTICAL', 'CALCULATED');
ALTER TABLE "FoodNutrient" ALTER COLUMN "derivationMethodology" TYPE "DerivationMethodology_new" USING ("derivationMethodology"::text::"DerivationMethodology_new");
ALTER TYPE "DerivationMethodology" RENAME TO "DerivationMethodology_old";
ALTER TYPE "DerivationMethodology_new" RENAME TO "DerivationMethodology";
DROP TYPE "DerivationMethodology_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "NutrientCategory_new" AS ENUM ('MACRONUTRIENT', 'MICRONUTRIENT', 'VITAMIN', 'MINERAL');
ALTER TABLE "Nutrient" ALTER COLUMN "category" TYPE "NutrientCategory_new" USING ("category"::text::"NutrientCategory_new");
ALTER TYPE "NutrientCategory" RENAME TO "NutrientCategory_old";
ALTER TYPE "NutrientCategory_new" RENAME TO "NutrientCategory";
DROP TYPE "NutrientCategory_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "VitaminSolubility_new" AS ENUM ('FAT', 'WATER');
ALTER TABLE "Nutrient" ALTER COLUMN "solubility" TYPE "VitaminSolubility_new" USING ("solubility"::text::"VitaminSolubility_new");
ALTER TYPE "VitaminSolubility" RENAME TO "VitaminSolubility_old";
ALTER TYPE "VitaminSolubility_new" RENAME TO "VitaminSolubility";
DROP TYPE "VitaminSolubility_old";
COMMIT;

-- AlterTable
ALTER TABLE "NutrientRequirement" DROP COLUMN "biologicalSex",
ADD COLUMN     "biologicalSex" "BioSex";

-- DropEnum
DROP TYPE "Sex";

-- CreateIndex
CREATE UNIQUE INDEX "NutrientRequirement_standardName_yearFrom_nutrientId_biolog_key" ON "NutrientRequirement"("standardName", "yearFrom", "nutrientId", "biologicalSex");
