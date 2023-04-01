/*
  Warnings:

  - Added the required column `numberOfGrams` to the `Food` table without a default value. This is not possible if the table is not empty.
  - Added the required column `source` to the `Food` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "FoodSource" AS ENUM ('USDA');

-- AlterTable
ALTER TABLE "Food" ADD COLUMN     "numberOfGrams" INTEGER NOT NULL,
ADD COLUMN     "source" "FoodSource" NOT NULL;
