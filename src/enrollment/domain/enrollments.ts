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

  isSucceeded(): boolean {
    return this.status === EnrollmentStatus.Success;
  }
}
