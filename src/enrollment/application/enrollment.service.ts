import { Inject, Injectable } from "@nestjs/common";
import {
  IEnrollmentsRepository,
  IEnrollmentsRepositoryToken,
} from "../domain/interfaces/enrollments-repository.interface";
import {ICourseRepository, ICourseRepositoryToken} from "../domain/interfaces/course-repository.interface";
import {EnrollmentErrorMessages, EnrollmentStatus} from "../domain/enrollments";

@Injectable()
export class EnrollmentService {
  constructor(
    @Inject(IEnrollmentsRepositoryToken)
    private readonly enrollmentRepository: IEnrollmentsRepository,
    @Inject(ICourseRepositoryToken)
    private readonly courseRepository: ICourseRepository
  ) {}

  async verifyEnrollment(userId: number, courseId: number, roundId: number) {
    const enrollmentDetails = await this.enrollmentRepository.getEnrollmentStatus(
      userId,
      courseId,
      roundId
    );
    if (!enrollmentDetails) {
      return false;
    }
    enrollmentDetails.isValidStatus()
    return true;
  }

  async enrollCourse(userId: number, courseId: number, roundId: number) {
    const round = await this.enrollmentRepository.findRoundById(roundId);
    round.validateDate();
    round.validateCapacity();

    const enrollmentDetails = await this.enrollmentRepository.getEnrollmentStatus(
        userId,
        courseId,
        roundId
        );

    if (enrollmentDetails && enrollmentDetails.isSucceeded()) {
      throw new Error(EnrollmentErrorMessages.alreadyEnrolled);
    }

    await this.enrollmentRepository.enrollForCourse(userId, courseId, roundId);
    // 특강 목록에 대한 정보를 조회할 때, 수강 등록 기능과 병목이 발생하지 않도록 rounds에서 조회할 수 있도록 동기화
    return this.courseRepository.syncRoundsWithCapacity(roundId);
  }
}
