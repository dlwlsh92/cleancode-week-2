import {EnrollmentDetails, EnrollmentStatus} from "../domain/enrollments";
import {Round} from "../domain/round";


export const enrollmentDetailsMock = (enrollmentDetails: Partial<EnrollmentDetails>): EnrollmentDetails => {
    const doc = {
        userId: 1,
        courseId: 1,
        roundId: 1,
        status: EnrollmentStatus.Success,
        ...enrollmentDetails
    }
    return new EnrollmentDetails(
        doc.userId,
        doc.courseId,
        doc.roundId,
        doc.userId,
        doc.status
    )
}

export const roundsMock = (round: Partial<Round>): Round => {
    const doc = {
        id: 1,
        enrollmentStartDate: new Date(),
        courseId: 1,
        enrolledCount: 1,
        maxEnrolledCapacity: 1,
        startDate: new Date(),
        ...round
    }
    return new Round(
        doc.id,
        doc.enrollmentStartDate,
        doc.courseId,
        doc.enrolledCount,
        doc.maxEnrolledCapacity,
        doc.startDate
    )
}