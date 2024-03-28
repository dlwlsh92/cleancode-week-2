import {PrismaService} from "../../prisma/prisma.service";
import {Test} from "@nestjs/testing";
import {EnrollmentService} from "../application/enrollment.service";
import {EnrollmentRepository} from "../infrastructure/persistence/enrollments.repository";
import {TestRepository} from "./test.repository";
import {EnrollmentModule} from "../enrollment.module";
import {Round} from "../domain/round";
import {EnrollmentStatus} from "../domain/enrollments";

describe('수강 등록 관련 기능(수강 등록, 수강 등록 조회) 테스트', () => {
    let enrollmentService: EnrollmentService;
    let testRepository: TestRepository;
    let seedData: Round;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            imports: [EnrollmentModule],
            providers: [TestRepository, PrismaService]
        }).compile();

        enrollmentService = module.get<EnrollmentService>(EnrollmentService);
        testRepository = module.get<TestRepository>(TestRepository);

        seedData = await testRepository.createSeedData(0, 1);
    })

    afterEach(async () => {
        await testRepository.deleteSeedData(seedData);
    })

    it('유효한 라운드이고, 수강 인원이 남아있을 경우 수강 등록이 가능하다.', async () => {
        const {courseId,id } = seedData;
        const userId = await testRepository.createUsers();
        const result = await enrollmentService.enrollCourse(userId, courseId, id);
        const enrollment = await testRepository.getEnrollmentByUserIdAndCourseIdAndRoundId(
            userId,
            courseId,
            id
        )
        expect(result).toBe(true);
        expect(enrollment?.status).toBe(EnrollmentStatus.Success);
        await testRepository.clearUserData(userId);
    })


    it('이미 수강 등록한 유저가 다시 수강 등록을 할 경우 "이미 등록한 특강입니다." 에러를 던진다.', async () => {
        /**
        * 특강 라운드에 해당하는 수강 등록을 먼저 시행하고, 다시 수강 등록을 할 경우 이미 등록한 특강임을 알려주는 에러를 던져야 한다.
        * */
        const {courseId, id} = seedData;
        const userId = await testRepository.createUsers();
        await testRepository.insertEnrollment(userId, courseId, id, EnrollmentStatus.Success);
        await expect(enrollmentService.enrollCourse(userId, courseId, id)).rejects.toThrow('이미 등록한 특강입니다.');
        await testRepository.clearUserData(userId);
    })

    it('수강 인원이 다 찬 경우 수강 등록이 불가능하다.', async () => {
        /**
        * 현재 테스트를 위해 생성된 특강 라운드의 최대 인원은 1명이므로 두 번째 특강 등록은 불가능해야 한다.
        * */
        const {courseId, id} = seedData;
        const userId = await testRepository.createUsers();
        const firstEnrollmentResult = await enrollmentService.enrollCourse(userId, courseId, id);
        expect(firstEnrollmentResult).toBe(true);
        const secondUserId = await testRepository.createUsers();
        await expect(enrollmentService.enrollCourse(secondUserId, courseId, id)).rejects.toThrow('해당 특강은 모집 인원이 다 찼습니다.');
        await testRepository.clearUserData(userId);
    })

});