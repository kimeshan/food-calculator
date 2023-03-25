/*
  Warnings:

  - A unique constraint covering the columns `[standardName,yearFrom,nutrientId]` on the table `NutrientRequirement` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "NutrientRequirement_standardName_yearFrom_nutrientId_key" ON "NutrientRequirement"("standardName", "yearFrom", "nutrientId");
