/*
  Warnings:

  - You are about to drop the column `publlicationDate` on the `FoodNutrient` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "FoodNutrient" DROP COLUMN "publlicationDate",
ADD COLUMN     "publicationDate" TIMESTAMP(3);
