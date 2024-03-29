import {EnrollmentStatus} from "../domain/enrollments";
import {enrollmentDetailsMock} from "./test.entities";


describe('수강 등록이 유효한지 검증하는 테스트', () => {
    it('유효한 수강 등록이면 true를 리턴한다.', () => {
        const enrollment = enrollmentDetailsMock({
            status: EnrollmentStatus.Success
        })
        expect(enrollment.isSucceeded()).toBe(true);
    })

    it('유효하지 않은 수강 등록이면 false를 리턴한다.', () => {
        const enrollment = enrollmentDetailsMock({
            status: EnrollmentStatus.Canceled
        })
        expect(enrollment.isSucceeded()).toBe(false);
    })
})