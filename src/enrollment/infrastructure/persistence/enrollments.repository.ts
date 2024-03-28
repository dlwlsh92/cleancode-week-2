import {Injectable} from "@nestjs/common";
import {EnrollmentDetails, EnrollmentStatus,} from "src/enrollment/domain/enrollments";
import {IEnrollmentsRepository} from "src/enrollment/domain/interfaces/enrollments-repository.interface";
import {PrismaService} from "src/prisma/prisma.service";
import {Round} from "../../domain/round";
import {Prisma} from "@prisma/client";

@Injectable()
export class EnrollmentRepository implements IEnrollmentsRepository {
  constructor(private readonly prisma: PrismaService) {}
  async getEnrollmentStatus(
    userId: number,
    courseId: number,
    roundId: number
  ): Promise<EnrollmentDetails | null> {
    // prisma를 이용해 userId, courseId, roundId로 EnrollmentDetails를 조회하는 코드 작성
    const enrollment = await this.prisma.enrollments.findUnique({
        where: {
          unique_enrollment: {
            userId,
            courseId,
            roundId,
          }
        }
    })
    if (!enrollment) {
      return null
    }
    const status = enrollment.status === EnrollmentStatus.Success ? EnrollmentStatus.Success : EnrollmentStatus.Canceled
    return new EnrollmentDetails(
        enrollment.id,
        enrollment.courseId,
        enrollment.roundId,
        enrollment.userId,
        status
    )
  }

  async enrollForCourse(
    userId: number,
    courseId: number,
    roundId: number
  ): Promise<boolean> {
    try {
        await this.prisma.$transaction(async (transactionalPrisma) => {
          const existingEnrollment = await this.prisma.enrollments.findUnique({
            where: {
              unique_enrollment: {
                userId,
                courseId,
                roundId,
              }
            }
          })

          if (existingEnrollment && existingEnrollment.status === EnrollmentStatus.Success) {
            throw new Error('이미 등록한 특강입니다.')
          }

          const round = await this.prisma.rounds.findUnique({
            where: { id: roundId },
            select: {
              enrolledCount: true,
              maxEnrolledCapacity: true,
            }
          })

          if (!round) {
            throw new Error('해당 특강은 존재하지 않는 특강입니다.')
          }

          if (round.enrolledCount >= round.maxEnrolledCapacity) {
            throw new Error('해당 특강은 모집 인원이 다 찼습니다.')
          }

          await this.prisma.rounds.update({
            where: { id: roundId },
            data: { enrolledCount: { increment: 1 } },
          });

          await this.prisma.enrollments.create({
              data: {
              courseId,
              roundId,
              userId,
              status: EnrollmentStatus.Success
              }
          })
        }, {
          isolationLevel: Prisma.TransactionIsolationLevel.Serializable
        })
    } catch (error) {
        throw new Error('특강 등록에 실패했습니다.')
    }
    return true;
  }

  async findRoundById(roundId: number) {
    const round = await this.prisma.rounds.findUnique({
      where: { id: roundId },
    })
    if (!round) {
      throw new Error('조회한 특강은 존재하지 않는 특강입니다.')
    }
    return new Round(
        round.id,
        round.enrollmentStartDate,
        round.courseId,
        round.enrolledCount,
        round.maxEnrolledCapacity,
        round.startDate,
    )
  }
}
