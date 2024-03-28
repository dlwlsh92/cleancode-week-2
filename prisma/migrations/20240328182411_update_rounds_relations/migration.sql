-- CreateTable
CREATE TABLE "RoundsCapacity" (
    "id" SERIAL NOT NULL,
    "enrolledCount" INTEGER NOT NULL,
    "maxEnrolledCapacity" INTEGER NOT NULL,
    "roundId" INTEGER NOT NULL,

    CONSTRAINT "RoundsCapacity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RoundsCapacity_roundId_key" ON "RoundsCapacity"("roundId");

-- AddForeignKey
ALTER TABLE "RoundsCapacity" ADD CONSTRAINT "RoundsCapacity_roundId_fkey" FOREIGN KEY ("roundId") REFERENCES "Rounds"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
