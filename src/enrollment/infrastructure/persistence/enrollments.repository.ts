import { Injectable } from "@nestjs/common";
import { Round } from "../../domain/round";
import { Prisma } from "@prisma/client";
import { IEnrollmentsRepository } from "../../domain/interfaces/enrollments-repository.interface";
import { PrismaService } from "../../../prisma/prisma.service";
import { EnrollmentDetails, EnrollmentStatus } from "../../domain/enrollments";


enum EnrollmentErrorMessages {
    alreadyEnrolled = "이미 등록한 특강입니다.",
    fullCapacity = "해당 특강은 모집 인원이 다 찼습니다.",
    notExistRound = "해당 특강은 존재하지 않는 특강입니다.",
}

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
        },
      },
    });
    if (!enrollment) {
      return null;
    }
    const status =
      enrollment.status === EnrollmentStatus.Success
        ? EnrollmentStatus.Success
        : EnrollmentStatus.Canceled;
    return new EnrollmentDetails(
      enrollment.id,
      enrollment.courseId,
      enrollment.roundId,
      enrollment.userId,
      status
    );
  }

  async enrollForCourse(
    userId: number,
    courseId: number,
    roundId: number
  ): Promise<boolean> {
    try {
      await this.prisma.$transaction(
        async (transactionalPrisma) => {
          const existingEnrollment =
            await transactionalPrisma.enrollments.findUnique({
              where: {
                unique_enrollment: {
                  userId,
                  courseId,
                  roundId,
                },
              },
            });

          if (
            existingEnrollment &&
            existingEnrollment.status === EnrollmentStatus.Success
          ) {
            throw new Error(EnrollmentErrorMessages.alreadyEnrolled);
          }

          /**
          * 해당 round의 enrolledCount 동시성을 제어를 위해 SELECT ... FOR UPDATE 사용
          * round 테이블의 다른 값들은 변경할 일이 잦지 않을 것으로 판단해서 enrolledCount와 maxEnrolledCapacity를 따로 테이블로 분리하지 않았습니다.
          * */
          const round = await transactionalPrisma.$queryRaw`
                                          SELECT "enrolledCount", "maxEnrolledCapacity"
                                          FROM "Rounds"
                                          WHERE "id" = ${roundId}
                                          FOR UPDATE`;

          if (!round) {
            throw new Error(EnrollmentErrorMessages.notExistRound);
          }

          if (round[0].enrolledCount >= round[0].maxEnrolledCapacity) {
            throw new Error(EnrollmentErrorMessages.fullCapacity);
          }

          await transactionalPrisma.rounds.update({
            where: { id: roundId },
            data: { enrolledCount: { increment: 1 } },
          });

          const enrollment = await transactionalPrisma.enrollments.create({
            data: {
              courseId,
              roundId,
              userId,
              status: EnrollmentStatus.Success,
            },
          });

          // 수강 취소를 할 경우 status를 canceled로 변경하기 때문에 추적을 위해 enrollmentHistory에 저장
          await transactionalPrisma.enrollmentHistory.create({
            data: {
              enrollmentId: enrollment.id,
                status: EnrollmentStatus.Success,
                memo: "수강 신청 완료",
                updatedAt: new Date(),
            },
          })
          return true
        },
      );
    } catch (error) {
        console.log("=>(enrollments.repository.ts:116) error.message", error.message);
    switch (error.message) {
        case EnrollmentErrorMessages.alreadyEnrolled:
            throw new Error(EnrollmentErrorMessages.alreadyEnrolled);
        case EnrollmentErrorMessages.fullCapacity:
            throw new Error(EnrollmentErrorMessages.fullCapacity);
        case EnrollmentErrorMessages.notExistRound:
            throw new Error(EnrollmentErrorMessages.notExistRound);
        default:
            throw new Error("수강 등록에 실패하였습니다.");
        }
    }
    return true;
  }

  async findRoundById(roundId: number) {
    const round = await this.prisma.rounds.findUnique({
      where: { id: roundId },
    });
    if (!round) {
      throw new Error("해당 특강은 존재하지 않는 특강입니다.");
    }
    return new Round(
      round.id,
      round.enrollmentStartDate,
      round.courseId,
      round.enrolledCount,
      round.maxEnrolledCapacity,
      round.startDate,
      round.roundName,
    );
  }
}
