import {CourseService} from "../application/course.service";
import {Controller, Get, Param} from "@nestjs/common";
import {IntValidationPipe} from "./validator/validator";


@Controller("courses")
export class CourseController {
    constructor(
        private readonly courseService: CourseService
    ) {}

    @Get(":courseId/rounds")
    async getRoundListByCourseId(@Param("courseId", IntValidationPipe) courseId: number) {
        const roundList = await this.courseService.getRoundListByCourseId(courseId)
        return roundList.map(round => {
            return {
                enrollmentStartDate: round.enrollmentStartDate,
                enrolledCount: round.enrolledCount,
                maxEnrolledCapacity: round.maxEnrolledCapacity,
                startDate: round.startDate,
                roundName: round.roundName,
            }
        })
    }
}