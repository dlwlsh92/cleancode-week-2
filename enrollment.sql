CREATE TABLE "Courses" (
    "id" SERIAL PRIMARY KEY,
    "title" VARCHAR NOT NULL
);

CREATE TABLE "Rounds" (
    "id" SERIAL PRIMARY KEY,
    "enrollmentStartDate" TIMESTAMP NOT NULL,
    "courseId" INTEGER NOT NULL,
    "enrolledCount" INTEGER NOT NULL,
    "maxEnrolledCapacity" INTEGER NOT NULL,
    "startDate" TIMESTAMP NOT NULL,
    "RoundName" VARCHAR NOT NULL,
    FOREIGN KEY ("courseId") REFERENCES "Courses"("id")
);

CREATE TABLE "Users" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR NOT NULL
);

CREATE TABLE "Enrollments" (
    "id" SERIAL PRIMARY KEY,
    "courseId" INTEGER NOT NULL,
    "roundId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "status" VARCHAR NOT NULL, -- Ensure the 'Status' enum is defined or converted to a VARCHAR.
    FOREIGN KEY ("courseId") REFERENCES "Courses"("id"),
    FOREIGN KEY ("roundId") REFERENCES "Rounds"("id"),
    FOREIGN KEY ("userId") REFERENCES "Users"("id"),
    CONSTRAINT "unique_enrollment" UNIQUE ("userId", "courseId", "roundId")
);
