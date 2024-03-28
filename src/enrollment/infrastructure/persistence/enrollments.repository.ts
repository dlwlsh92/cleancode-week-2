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

          console.log("=>(enrollments.repository.ts:62) existingEnrollment", existingEnrollment);

          if (
            existingEnrollment &&
            existingEnrollment.status === EnrollmentStatus.Success
          ) {
              console.log("=>(enrollments.repository.ts:68) if문으로 들어옴." );
            throw new Error(EnrollmentErrorMessages.alreadyEnrolled);
          }


          const round = await transactionalPrisma.rounds.findUnique({
            where: { id: roundId },
            select: {
              enrolledCount: true,
              maxEnrolledCapacity: true,
            }
          })

            console.log("=>(enrollments.repository.ts:81) round", round);

          if (!round) {
            throw new Error(EnrollmentErrorMessages.notExistRound);
          }

          if (round.enrolledCount >= round.maxEnrolledCapacity) {
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

          return enrollment.status === EnrollmentStatus.Success;
        },
        {
          isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
        }
      );
    } catch (error) {
    console.log("=>(enrollments.repository.ts:118) error.message", error.message);
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
      round.startDate
    );
  }
}
