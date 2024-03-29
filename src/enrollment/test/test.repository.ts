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
                roundName: 'validRound'
            }
        })

        await this.prismaService.roundsCapacity.create({
            data: {
                roundId: validRound.id,
                enrolledCount: enrolledCount,
                maxEnrolledCapacity: maxEnrolledCapacity
            }
        })

        return new Round(
            validRound.id,
            validRound.enrollmentStartDate,
            validRound.courseId,
            validRound.enrolledCount,
            validRound.maxEnrolledCapacity,
            validRound.startDate,
            validRound.roundName,
        )
    }

    async createSeedDataWithChapterFourTest(enrolledCount: number, maxEnrolledCapacity: number) {
        const course = await this.prismaService.courses.create({
            data: {
                title: 'test',
            }
        })
        const firstRound = await this.prismaService.rounds.create({
            data: {
                enrollmentStartDate: addHoursToCurrentTime(1),
                courseId: course.id,
                enrolledCount: enrolledCount,
                maxEnrolledCapacity: maxEnrolledCapacity,
                startDate: addHoursToCurrentTime(2),
                roundName: 'firstRound'
            }
        })
        await this.prismaService.roundsCapacity.create({
            data: {
                roundId: firstRound.id,
                enrolledCount: enrolledCount,
                maxEnrolledCapacity: maxEnrolledCapacity
            }
        })
        const secondRound = await this.prismaService.rounds.create({
            data: {
                enrollmentStartDate: addHoursToCurrentTime(1),
                courseId: course.id,
                enrolledCount: enrolledCount,
                maxEnrolledCapacity: maxEnrolledCapacity,
                startDate: addHoursToCurrentTime(2),
                roundName: 'secondRound'
            }
        })
        await this.prismaService.roundsCapacity.create({
            data: {
                roundId: secondRound.id,
                enrolledCount: enrolledCount,
                maxEnrolledCapacity: maxEnrolledCapacity
            }

        })
        return {
            courseId: course.id,
            firstRoundId: firstRound.id,
            secondRoundId: secondRound.id
        }
    }

    async createUsers() {
        const result = await this.prismaService.users.create({
            data: {
                name: 'test',
            }
        })
        return result.id;
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

    async deleteAll() {
        await this.prismaService.enrollmentHistory.deleteMany({});
        await this.prismaService.enrollments.deleteMany({});
        await this.prismaService.users.deleteMany({});
        await this.prismaService.roundsCapacity.deleteMany({});
        await this.prismaService.rounds.deleteMany({});
        await this.prismaService.courses.deleteMany({});
    }


    async getRoundById(roundId: number) {
        const result = await this.prismaService.rounds.findUnique({
            where: {
                id: roundId
            }
        })
        if (!result) return null;
        return new Round(
            result.id,
            result.enrollmentStartDate,
            result.courseId,
            result.enrolledCount,
            result.maxEnrolledCapacity,
            result.startDate,
            result.roundName
        )
    }

    async getRoundCapacityByRoundId(roundId: number) {
        const result = await this.prismaService.roundsCapacity.findUnique({
            where: {
                roundId: roundId
            }
        })
        return result;
    }

    async getEnrollmentsByRoundId(roundId: number) {
        const result = await this.prismaService.enrollments.findMany({
            where: {
                roundId: roundId
            }
        })
        return result;
    }

    async getRoundCapacityWithRetry(roundId: number, maxRetries = 10, delay = 100) {
        let attempt = 0;
        let roundCapacity;

        while (attempt < maxRetries) {
            roundCapacity = await this.getRoundCapacityByRoundId(roundId);

            if (roundCapacity !== undefined) {
                return roundCapacity;
            }

            attempt++;
            await new Promise(resolve => setTimeout(resolve, delay * attempt)); // Exponential back-off
        }

        return roundCapacity;
    }
}
