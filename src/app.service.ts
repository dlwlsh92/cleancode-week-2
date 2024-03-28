import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
  getHello(): string {
    return "Hello World!!!!!!";
  }
}

// type Status = "success" | "canceled";

// interface Courses {
//   id: number;
//   title: string;
// }

// interface Rounds {
//   id: number;
//   enrollmentStart: Date;
//   courseId: number; // FK
//   currentEnrollment: number;
//   maxEnrollment: number;
//   startDate: Date;
//   RoundName: string;
// }

// interface Enrollments {
//   id: number;
//   courseId: number; // FK
//   roundId: number; // FK
//   userId: number; // FK
//   status: Status;
// }

// interface Users {
//   id: number;
//   name: string;
//   email: string;
//   password: string;
// }

// interface EnrollmentHistory {
//   id: number;
//   enrollmentId: number; // FK
//   status: Status;
//   memo: string;
//   updatedAt: Date;
// }
