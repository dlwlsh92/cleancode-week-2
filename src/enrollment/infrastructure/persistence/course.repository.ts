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

    async syncRoundsWithCapacity(roundId: number) {
        const roundCapacity = await this.prisma.roundsCapacity.findUnique({
            where: {
                roundId
            }
        })
        if (!roundCapacity) {
            throw new Error("해당 특강의 모집 인원 정보가 존재하지 않습니다.")
        }
        const round = await this.prisma.rounds.update({
            where: {
                id: roundId
            },
            data: {
                enrolledCount: roundCapacity.enrolledCount
            }
        })
        return roundCapacity.enrolledCount === round.enrolledCount
    }
}