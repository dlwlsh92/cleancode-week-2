import { Injectable } from "@nestjs/common";
import { Round } from "../../domain/round";
import { IEnrollmentsRepository } from "../../domain/interfaces/enrollments-repository.interface";
import { PrismaService } from "../../../prisma/prisma.service";
import {EnrollmentDetails, EnrollmentErrorMessages, EnrollmentStatus} from "../../domain/enrollments";

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
          /**
          * 해당 roundCapacity의 enrolledCount 동시성을 제어를 위해 SELECT ... FOR UPDATE 사용
          * 특강의 날짜별 정보를 조회하기 위해 roundId를 이용하여 RoundsCapacity 테이블에서 enrolledCount와 maxEnrolledCapacity를 조회
          * roundCapacity만 lock을 걸어 rounds의 정보를 조회하는데 문제 없도록 하기 위함.
          * */
          const roundCapacity = await transactionalPrisma.$queryRaw`
            SELECT "enrolledCount", "maxEnrolledCapacity"
            FROM "RoundsCapacity"
            WHERE "roundId" = ${roundId}
            FOR UPDATE`;

          if (!roundCapacity) {
            throw new Error(EnrollmentErrorMessages.notExistRound);
          }

          if (roundCapacity[0].enrolledCount >= roundCapacity[0].maxEnrolledCapacity) {
            throw new Error(EnrollmentErrorMessages.fullCapacity);
          }

          await transactionalPrisma.roundsCapacity.update({
            where: { roundId },
            data: { enrolledCount: { increment: 1 } },
          });

          /**
          * courseId, roundId, userId를 unique key로 설정함으로써 동일한 수강 신청을 방지
          * */
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
        },
      );
    } catch (error) {
        console.log("=>(enrollments.repository.ts:116) error.message", error.message);
        throw new Error(error.message);
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
