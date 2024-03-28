/*
  Warnings:

  - You are about to drop the column `currentEnrollment` on the `Rounds` table. All the data in the column will be lost.
  - You are about to drop the column `enrollmentStart` on the `Rounds` table. All the data in the column will be lost.
  - You are about to drop the column `maxEnrollment` on the `Rounds` table. All the data in the column will be lost.
  - Added the required column `enrolledCount` to the `Rounds` table without a default value. This is not possible if the table is not empty.
  - Added the required column `enrollmentStartDate` to the `Rounds` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maxEnrolledCapacity` to the `Rounds` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Rounds" DROP COLUMN "currentEnrollment",
DROP COLUMN "enrollmentStart",
DROP COLUMN "maxEnrollment",
ADD COLUMN     "enrolledCount" INTEGER NOT NULL,
ADD COLUMN     "enrollmentStartDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "maxEnrolledCapacity" INTEGER NOT NULL;
