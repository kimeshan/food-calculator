/*
  Warnings:

  - A unique constraint covering the columns `[source,sourceRefId]` on the table `Food` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,source]` on the table `Food` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Food" ADD COLUMN     "category" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "publlicationDate" TIMESTAMP(3),
ADD COLUMN     "sourceRefId" TEXT;

-- AlterTable
ALTER TABLE "FoodNutrient" ADD COLUMN     "publlicationDate" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "Food_source_sourceRefId_key" ON "Food"("source", "sourceRefId");

-- CreateIndex
CREATE UNIQUE INDEX "Food_name_source_key" ON "Food"("name", "source");
