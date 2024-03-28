import { EnrollmentService } from "./../application/enrollment.service";
import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { CourseDataDto } from "./enrollment.dto";

@Controller("enrollment")
export class EnrollmentController {
  constructor(private readonly enrollmentService: EnrollmentService) {}

  // user가 특정 course의 round에 등록하는 API
  @Post("users/:userId/enroll/course")
  async enroll(
    @Param("userId") userId: number,
    @Body() courseInfoDto: CourseDataDto
  ): Promise<boolean> {
    return this.enrollmentService.enrollCourse(
      userId,
      courseInfoDto.courseId,
      courseInfoDto.roundId
    );
  }

  // user가 특정 course의 round에 등록된 상태인지 확인하는 API
  @Get("users/:userId/courses/:courseId/rounds/:roundId/enrollment-status")
  async verifyEnrollment(
    @Param("userId") userId: number,
    @Param("courseId") courseId: number,
    @Param("roundId") roundId: number
  ): Promise<boolean> {
    return this.enrollmentService.verifyEnrollment(userId, courseId, roundId);
  }
}
