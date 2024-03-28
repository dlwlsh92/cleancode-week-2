import { PrismaService } from "./../prisma/prisma.service";
import { Module } from "@nestjs/common";
import { EnrollmentController } from "./controller/enrollment.controller";
import { EnrollmentService } from "./application/enrollment.service";
import { IEnrollmentsRepositoryToken } from "./domain/interfaces/enrollments-repository.interface";
import { EnrollmentRepository } from "./infrastructure/persistence/enrollments.repository";

@Module({
  controllers: [EnrollmentController],
  providers: [
    EnrollmentService,
    PrismaService,
    { provide: IEnrollmentsRepositoryToken, useClass: EnrollmentRepository },
  ],
})
export class EnrollmentModule {}
