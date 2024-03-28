import { Inject, Injectable } from "@nestjs/common";
import {
  IEnrollmentsRepository,
  IEnrollmentsRepositoryToken,
} from "../domain/interfaces/enrollments-repository.interface";

@Injectable()
export class EnrollmentService {
  constructor(
    @Inject(IEnrollmentsRepositoryToken)
    private readonly enrollmentRepository: IEnrollmentsRepository
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
    return this.enrollmentRepository.enrollForCourse(userId, courseId, roundId);
  }
}
