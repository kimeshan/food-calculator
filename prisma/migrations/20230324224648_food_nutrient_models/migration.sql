/*
  Warnings:

  - You are about to drop the column `amount` on the `Nutrient` table. All the data in the column will be lost.
  - You are about to drop the column `derivedCode` on the `Nutrient` table. All the data in the column will be lost.
  - You are about to drop the column `derivedDescription` on the `Nutrient` table. All the data in the column will be lost.
  - You are about to drop the column `foodId` on the `Nutrient` table. All the data in the column will be lost.
  - You are about to drop the column `rank` on the `Nutrient` table. All the data in the column will be lost.
  - You are about to drop the column `unit` on the `Nutrient` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Food` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Nutrient` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `category` to the `Nutrient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Nutrient` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "NutrientCategory" AS ENUM ('macro', 'vitamin', 'mineral');

-- CreateEnum
CREATE TYPE "VitaminSolubility" AS ENUM ('fat', 'water');

-- CreateEnum
CREATE TYPE "Sex" AS ENUM ('male', 'female');

-- CreateEnum
CREATE TYPE "FoodNutrientSource" AS ENUM ('USDA');

-- CreateEnum
CREATE TYPE "DerivationMethodology" AS ENUM ('analytical', 'calculated');

-- DropForeignKey
ALTER TABLE "Nutrient" DROP CONSTRAINT "Nutrient_foodId_fkey";

-- AlterTable
ALTER TABLE "Nutrient" DROP COLUMN "amount",
DROP COLUMN "derivedCode",
DROP COLUMN "derivedDescription",
DROP COLUMN "foodId",
DROP COLUMN "rank",
DROP COLUMN "unit",
ADD COLUMN     "category" "NutrientCategory" NOT NULL,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "solubility" "VitaminSolubility";

-- CreateTable
CREATE TABLE "NutrientRequirements" (
    "id" SERIAL NOT NULL,
    "standardName" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "sourceURL" TEXT NOT NULL,
    "yearFrom" INTEGER NOT NULL,
    "ageGroupStart" INTEGER,
    "ageGroupEnd" INTEGER,
    "biologicalSex" "Sex",
    "amountMicroMg" DOUBLE PRECISION NOT NULL,
    "nutrientId" INTEGER NOT NULL,

    CONSTRAINT "NutrientRequirements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FoodNutrient" (
    "id" SERIAL NOT NULL,
    "amountMicroMg" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "derivationMethodology" "DerivationMethodology" NOT NULL,
    "source" "FoodNutrientSource" NOT NULL,
    "sourceUrl" TEXT NOT NULL,
    "foodId" INTEGER NOT NULL,
    "nutrientId" INTEGER NOT NULL,

    CONSTRAINT "FoodNutrient_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FoodNutrient_foodId_nutrientId_source_key" ON "FoodNutrient"("foodId", "nutrientId", "source");

-- CreateIndex
CREATE UNIQUE INDEX "Food_name_key" ON "Food"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Nutrient_name_key" ON "Nutrient"("name");

-- AddForeignKey
ALTER TABLE "NutrientRequirements" ADD CONSTRAINT "NutrientRequirements_nutrientId_fkey" FOREIGN KEY ("nutrientId") REFERENCES "Nutrient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FoodNutrient" ADD CONSTRAINT "FoodNutrient_foodId_fkey" FOREIGN KEY ("foodId") REFERENCES "Food"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FoodNutrient" ADD CONSTRAINT "FoodNutrient_nutrientId_fkey" FOREIGN KEY ("nutrientId") REFERENCES "Nutrient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
