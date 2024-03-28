export enum EnrollmentStatus {
  Success = "success",
  Canceled = "canceled",
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
}
