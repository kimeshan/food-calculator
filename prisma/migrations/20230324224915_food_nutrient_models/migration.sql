/*
  Warnings:

  - You are about to drop the `NutrientRequirements` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "NutrientRequirements" DROP CONSTRAINT "NutrientRequirements_nutrientId_fkey";

-- DropTable
DROP TABLE "NutrientRequirements";

-- CreateTable
CREATE TABLE "NutrientRequirement" (
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

    CONSTRAINT "NutrientRequirement_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "NutrientRequirement" ADD CONSTRAINT "NutrientRequirement_nutrientId_fkey" FOREIGN KEY ("nutrientId") REFERENCES "Nutrient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
