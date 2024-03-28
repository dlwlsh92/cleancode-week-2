import {roundsMock} from "./test.entities";
import {addHoursToCurrentTime} from "./util.test";


describe('수강 등록 시 유효한 강의 기수인지 확인하는 테스트', () => {

    it('특강 날짜가 종료된 수강 등록일 경우 특강이 종료되었다는 에러를 던진다.', () => {
        const round = roundsMock({
            startDate: addHoursToCurrentTime(-1),
        })
        expect(() => round.validateDate()).toThrowError('해당 특강은 이미 종료되었습니다.');
    })

    it('특강 모집일이 시작되지 않은 수강 등록일 경우 특강 모집일이 아직 시작하지 않았다는 에러를 던진다.', () => {
        const round = roundsMock({
            enrollmentStartDate: addHoursToCurrentTime(-1),
        })
        expect(() => round.validateDate()).toThrowError('해당 특강 모집일은 아직 시작하지 않았습니다.');
    })

    it('특강 모집 인원이 다 찬 경우 특강 모집 인원이 다 찼다는 에러를 던진다.', () => {
        const round = roundsMock({
            enrolledCount: 1,
            maxEnrolledCapacity: 1,
        })
        const round2 = roundsMock({
            enrolledCount: 2,
            maxEnrolledCapacity: 1,
        })
        expect(() => round.validateCapacity()).toThrowError('해당 특강은 모집 인원이 다 찼습니다.');
        expect(() => round2.validateCapacity()).toThrowError('해당 특강은 모집 인원이 다 찼습니다.');
    })

    it('특강 모집 인원이 다 차지 않은 경우 true를 리턴한다.', () => {
        const round = roundsMock({
            enrolledCount: 0,
            maxEnrolledCapacity: 1,
        })
        expect(round.validateCapacity()).toBe(true);
    })

    it('특강 등록 일자가 유효한 경우 true를 리턴한다.', () => {
        const round = roundsMock({
            startDate: addHoursToCurrentTime(1),
            enrollmentStartDate: addHoursToCurrentTime(1),
        })
        expect(round.validateDate()).toBe(true);
    })
})