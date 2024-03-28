-- CreateEnum
CREATE TYPE "Status" AS ENUM ('success', 'canceled');

-- CreateTable
CREATE TABLE "Courses" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "Courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rounds" (
    "id" SERIAL NOT NULL,
    "enrollmentStart" TIMESTAMP(3) NOT NULL,
    "courseId" INTEGER NOT NULL,
    "currentEnrollment" INTEGER NOT NULL,
    "maxEnrollment" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "RoundName" TEXT NOT NULL,

    CONSTRAINT "Rounds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Enrollments" (
    "id" SERIAL NOT NULL,
    "courseId" INTEGER NOT NULL,
    "roundId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "status" "Status" NOT NULL,

    CONSTRAINT "Enrollments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Users" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EnrollmentHistory" (
    "id" SERIAL NOT NULL,
    "enrollmentId" INTEGER NOT NULL,
    "status" "Status" NOT NULL,
    "memo" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EnrollmentHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Enrollments_courseId_userId_roundId_key" ON "Enrollments"("courseId", "userId", "roundId");

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- AddForeignKey
ALTER TABLE "Rounds" ADD CONSTRAINT "Rounds_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enrollments" ADD CONSTRAINT "Enrollments_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enrollments" ADD CONSTRAINT "Enrollments_roundId_fkey" FOREIGN KEY ("roundId") REFERENCES "Rounds"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enrollments" ADD CONSTRAINT "Enrollments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EnrollmentHistory" ADD CONSTRAINT "EnrollmentHistory_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "Enrollments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
