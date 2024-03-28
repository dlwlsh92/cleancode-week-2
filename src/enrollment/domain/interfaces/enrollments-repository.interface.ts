import { EnrollmentDetails } from "../enrollments";
import {Round} from "../round";

export const IEnrollmentsRepositoryToken = Symbol("IEnrollmentsRepository");

export interface IEnrollmentsRepository {
  getEnrollmentStatus(
    userId: number,
    courseId: number,
    roundId: number
  ): Promise<EnrollmentDetails | null>;
  enrollForCourse(
    userId: number,
    courseId: number,
    roundId: number
  ): Promise<boolean>;
  findRoundById(roundId: number): Promise<Round>
}
