import { EnrollmentService } from "./../application/enrollment.service";
import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { CourseDataDto } from "./enrollment.dto";
import {CourseDataDtoValidationPipe, IntValidationPipe} from "./validator/validator";

@Controller("enrollment")
export class EnrollmentController {
  constructor(private readonly enrollmentService: EnrollmentService) {}

  // user가 특정 course의 round에 등록하는 API
  @Post("users/:userId/enroll/course")
  async enroll(
    @Param("userId", IntValidationPipe) userId: number,
    @Body(CourseDataDtoValidationPipe) courseInfoDto: CourseDataDto
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
    @Param("userId", IntValidationPipe) userId: number,
    @Param("courseId", IntValidationPipe) courseId: number,
    @Param("roundId", IntValidationPipe) roundId: number
  ): Promise<boolean> {
    return this.enrollmentService.verifyEnrollment(userId, courseId, roundId);
  }

  @Get(':id')
  async test(@Param('id', IntValidationPipe) id: number) {
    console.log(id)
    console.log(typeof id)
    return id
  }

  @Post('test')
  async test2(@Body(CourseDataDtoValidationPipe) body: any) {
    console.log(body)
    return body
  }
}
