


export class Round {
    constructor(
        public id: number,
        public enrollmentStartDate: Date,
        public courseId: number,
        public enrolledCount: number,
        public maxEnrolledCapacity: number,
        public startDate: Date,
    ) {}

    validateDate(): boolean {
        const currentDate = new Date();
        if (this.startDate < currentDate) {
            throw new Error('해당 특강은 이미 종료되었습니다.')
        }
        if (this.enrollmentStartDate < currentDate) {
            throw new Error('해당 특강 모집일은 아직 시작하지 않았습니다.')
        }
        return true;
    }

    validateCapacity(): boolean {
        if (this.enrolledCount >= this.maxEnrolledCapacity) {
            throw new Error('해당 특강은 모집 인원이 다 찼습니다.')
        }
        return true;
    }
}