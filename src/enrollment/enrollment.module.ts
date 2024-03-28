import { PrismaService } from "./../prisma/prisma.service";
import { Module } from "@nestjs/common";
import { EnrollmentController } from "./controller/enrollment.controller";
import { EnrollmentService } from "./application/enrollment.service";
import { IEnrollmentsRepositoryToken } from "./domain/interfaces/enrollments-repository.interface";
import { EnrollmentRepository } from "./infrastructure/persistence/enrollments.repository";
import {ICourseRepositoryToken} from "./domain/interfaces/course-repository.interface";
import {CourseRepository} from "./infrastructure/persistence/course.repository";
import {CourseController} from "./controller/course.controller";
import {CourseService} from "./application/course.service";

@Module({
  controllers: [EnrollmentController, CourseController],
  providers: [
    EnrollmentService,
    PrismaService,
      CourseService,
    { provide: IEnrollmentsRepositoryToken, useClass: EnrollmentRepository },
    {provide: ICourseRepositoryToken, useClass: CourseRepository}
  ],
})
export class EnrollmentModule {}
