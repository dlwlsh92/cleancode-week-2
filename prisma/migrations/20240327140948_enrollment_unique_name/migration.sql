/*
  Warnings:

  - A unique constraint covering the columns `[userId,courseId,roundId]` on the table `Enrollments` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Enrollments_courseId_userId_roundId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Enrollments_userId_courseId_roundId_key" ON "Enrollments"("userId", "courseId", "roundId");
