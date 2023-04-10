/*
  Warnings:

  - You are about to drop the column `publlicationDate` on the `Food` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Food" DROP COLUMN "publlicationDate",
ADD COLUMN     "publicationDate" TIMESTAMP(3);
