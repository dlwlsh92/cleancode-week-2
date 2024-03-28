import {EnrollmentStatus} from "../domain/enrollments";
import {enrollmentDetailsMock} from "./test.entities";


describe('수강 등록이 유효한지 검증하는 테스트', () => {
    it('유효한 수강 등록이면 true를 리턴한다.', () => {
        const enrollment = enrollmentDetailsMock({
            status: EnrollmentStatus.Success
        })
        expect(enrollment.isValidStatus()).toBe(true);
    })

    it('취소된 수강 등록이면 이미 취소된 수강신청입니다. 에러를 던진다.', () => {
        const enrollment = enrollmentDetailsMock({
            status: EnrollmentStatus.Canceled
        })
        expect(() => enrollment.isValidStatus()).toThrowError('이미 취소된 수강신청입니다.');
    })
})