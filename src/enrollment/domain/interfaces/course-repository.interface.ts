import {Round} from "../round";


export const ICourseRepositoryToken = Symbol("ICourseRepository");
export interface ICourseRepository {
    findRoundByCourseId(courseId: number): Promise<Round[]>;
    syncRoundsWithCapacity(roundId: number): Promise<boolean>;
}