import {PrismaService} from "../../prisma/prisma.service";
import {addHoursToCurrentTime} from "./util.test";
import {Round} from "../domain/round";
import {Injectable} from "@nestjs/common";
import {EnrollmentStatus} from "../domain/enrollments";

@Injectable()
export class TestRepository {
    constructor(
        private readonly prismaService: PrismaService
    ) {}

    async createSeedData(enrolledCount: number, maxEnrolledCapacity: number) {
        const course = await this.prismaService.courses.create({
            data: {
                title: 'test',
            }
        })
        /**
        * 등록 시작 날짜와 강연 날짜에 대한 유효성 검증은 domain logic 검증에서 확인했으므로 여기서는 인원 수에 대한 조정만 가능케함.
        * */
        const validRound = await this.prismaService.rounds.create({
            data: {
                enrollmentStartDate: addHoursToCurrentTime(1),
                courseId: course.id,
                enrolledCount: enrolledCount,
                maxEnrolledCapacity: maxEnrolledCapacity,
                startDate: addHoursToCurrentTime(2),
                RoundName: 'validRound'
            }
        })
        return new Round(
            validRound.id,
            validRound.enrollmentStartDate,
            validRound.courseId,
            validRound.enrolledCount,
            validRound.maxEnrolledCapacity,
            validRound.startDate
        )
    }

    async deleteSeedData(round: Round) {
        await this.prismaService.rounds.delete({
            where: {
                id: round.id
            }
        })
        await this.prismaService.courses.delete({
            where: {
                id: round.courseId
            }
        })
    }

    async createUsers() {
        const result = await this.prismaService.users.create({
            data: {
                name: 'test',
            }
        })
        return result.id;
    }

    async clearUserData(userId: number) {
        await this.prismaService.enrollments.deleteMany({
            where: {
                userId: userId
            }
        })
        await this.prismaService.users.delete({
            where: {
                id: userId
            }
        })
    }

    async getEnrollmentByUserIdAndCourseIdAndRoundId(userId: number, courseId: number, roundId: number) {
        const result = await this.prismaService.enrollments.findUnique({
            where: {
                unique_enrollment: {
                    userId: userId,
                    courseId: courseId,
                    roundId: roundId
                }
            }
        })
        return result;
    }

    async insertEnrollment(userId: number, courseId: number, roundId: number, status: EnrollmentStatus) {
        const result = await this.prismaService.enrollments.create({
            data: {
                courseId,
                roundId,
                userId,
                status
            }
        })
        return result
    }
}
