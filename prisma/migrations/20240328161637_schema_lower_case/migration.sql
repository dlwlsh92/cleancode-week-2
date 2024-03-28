/*
  Warnings:

  - You are about to drop the column `RoundName` on the `Rounds` table. All the data in the column will be lost.
  - Added the required column `roundName` to the `Rounds` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Rounds" DROP COLUMN "RoundName",
ADD COLUMN     "roundName" TEXT NOT NULL;
