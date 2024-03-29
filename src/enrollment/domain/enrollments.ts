export enum EnrollmentStatus {
  Success = "success",
  Canceled = "canceled",
}

export enum EnrollmentErrorMessages {
  alreadyEnrolled = "이미 등록한 특강입니다.",
  fullCapacity = "해당 특강은 모집 인원이 다 찼습니다.",
  notExistRound = "해당 특강은 존재하지 않는 특강입니다.",
}

export class EnrollmentDetails {
  constructor(
    public id: number,
    public courseId: number,
    public roundId: number,
    public userId: number,
    public status: EnrollmentStatus
  ) {}

  isValidStatus(): boolean  {
    if (this.status === EnrollmentStatus.Canceled) {
      throw new Error("이미 취소된 수강신청입니다.");
    }
    return true;
  }

  isSucceeded(): boolean {
    return this.status === EnrollmentStatus.Success;
  }
}
