import {Injectable} from "@nestjs/common";
import {ICourseRepository} from "../../domain/interfaces/course-repository.interface";
import {PrismaService} from "../../../prisma/prisma.service";
import {Round} from "../../domain/round";


@Injectable()
export class CourseRepository implements ICourseRepository {
    constructor(
        private readonly prisma: PrismaService
    ) {}

    async findRoundByCourseId(courseId: number) {
        const rounds = await this.prisma.rounds.findMany({
            where: {
                courseId
            }
        })
        return rounds.map(round => new Round(
            round.id,
            round.enrollmentStartDate,
            round.courseId,
            round.enrolledCount,
            round.maxEnrolledCapacity,
            round.startDate,
            round.roundName
        ))
    }
}