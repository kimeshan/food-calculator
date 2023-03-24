/*
  Warnings:

  - You are about to drop the column `value` on the `Nutrient` table. All the data in the column will be lost.
  - Added the required column `amount` to the `Nutrient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `derivedCode` to the `Nutrient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `derivedDescription` to the `Nutrient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rank` to the `Nutrient` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Nutrient" DROP COLUMN "value",
ADD COLUMN     "amount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "derivedCode" TEXT NOT NULL,
ADD COLUMN     "derivedDescription" TEXT NOT NULL,
ADD COLUMN     "rank" INTEGER NOT NULL;
