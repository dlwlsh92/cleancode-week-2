import {Inject, Injectable} from "@nestjs/common";
import {ICourseRepository, ICourseRepositoryToken} from "../domain/interfaces/course-repository.interface";


@Injectable()
export class CourseService {
    constructor(
        @Inject(ICourseRepositoryToken)
        private readonly courseRepository: ICourseRepository
    ) {}

    async getRoundListByCourseId(courseId: number) {
        return this.courseRepository.findRoundByCourseId(courseId)
    }
}