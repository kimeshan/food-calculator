/*
  Warnings:

  - A unique constraint covering the columns `[standardName,yearFrom,nutrientId,biologicalSex]` on the table `NutrientRequirement` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "NutrientRequirement_standardName_yearFrom_nutrientId_key";

-- CreateIndex
CREATE UNIQUE INDEX "NutrientRequirement_standardName_yearFrom_nutrientId_biolog_key" ON "NutrientRequirement"("standardName", "yearFrom", "nutrientId", "biologicalSex");
