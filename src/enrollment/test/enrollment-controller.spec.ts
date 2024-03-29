import {INestApplication} from "@nestjs/common";
import { Test } from "@nestjs/testing";
import * as request from "supertest";
import {EnrollmentModule} from "../enrollment.module";
import {TestRepository} from "./test.repository";
import {Round} from "../domain/round";
import {PrismaService} from "../../prisma/prisma.service";
import {EnrollmentStatus} from "../domain/enrollments";


describe('동시 수강 신청에 대한 API 테스트', () => {
    let app: INestApplication;
    let testRepository: TestRepository;
    let seedData: Round;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [EnrollmentModule],
            providers: [TestRepository, PrismaService]
        }).compile();

        app = moduleRef.createNestApplication();
        await app.init();

        testRepository = moduleRef.get<TestRepository>(TestRepository);
    })

    beforeEach(async () => {
        await testRepository.deleteAll();

    })

    describe('동시 수강 신청에 대한 API 테스트', () => {
        it('최대 정원을 초과하는 인원이 수강 신청을 해도 30명까지만 수강 신청이 가능하다.', async () => {
            seedData = await testRepository.createSeedData(0, 30);
            const {courseId, id} = seedData;
            const registerCount = 40;
            let createdUsers: number[] = [];

            const userIds = await Promise.all(
                Array.from({length: registerCount}, async (_, index) => {
                    const userId = await testRepository.createUsers();
                    createdUsers.push(userId);
                    return userId;
                })
            )
            const requests = userIds.map(userId => {
                return request(app.getHttpServer())
                    .post(`/enrollment/users/${userId}/enroll/course`)
                    .send({
                        courseId,
                        roundId: id
                    })
            })
            await Promise.all(requests);
            const roundCapacity = await testRepository.getRoundCapacityWithRetry(id);
            const enrollments = await testRepository.getEnrollmentsByRoundId(id);

            expect(roundCapacity?.enrolledCount).toBe(30);
            expect(enrollments.length).toBe(30);
            expect(enrollments.filter(enrollment => enrollment.status === EnrollmentStatus.Success).length).toBe(30);
        }, 10000)
    })

    it('여러 기수에 동시 수강신청이 들어와도 30명까지만 수강 신청이 가능하다.', async () => {
        const {courseId, firstRoundId, secondRoundId} = await testRepository.createSeedDataWithChapterFourTest(0, 30)
        const registerCount = 40;
        let firstCreatedUsers: number[] = [];
        let secondCreatedUsers: number[] = [];

        const firstRoundIds = await Promise.all(
            Array.from({length: registerCount}, async (_, index) => {
                const userId = await testRepository.createUsers();
                firstCreatedUsers.push(userId);
                return userId;
            })
        )

        const secondRoundIds = await Promise.all(
            Array.from({length: registerCount}, async (_, index) => {
                const userId = await testRepository.createUsers();
                secondCreatedUsers.push(userId);
                return userId;
            })
        )

        const requestCondition = [
            ...firstRoundIds.map(userId => ({userId, roundId: firstRoundId, courseId})),
            ...secondRoundIds.map(userId => ({userId, roundId: secondRoundId, courseId}))
        ]

        const requests = requestCondition.map(({userId, roundId, courseId}) => {
            return request(app.getHttpServer())
                .post(`/enrollment/users/${userId}/enroll/course`)
                .send({
                    courseId,
                    roundId
                })
        })

        await Promise.all(requests);

        const firstRoundCapacity = await testRepository.getRoundCapacityByRoundId(firstRoundId);
        const secondRoundCapacity = await testRepository.getRoundCapacityByRoundId(secondRoundId);
        const firstRoundEnrollments = await testRepository.getEnrollmentsByRoundId(firstRoundId);
        const secondRoundEnrollments = await testRepository.getEnrollmentsByRoundId(secondRoundId);

        expect(firstRoundCapacity?.enrolledCount).toBe(30);
        expect(secondRoundCapacity?.enrolledCount).toBe(30);

        expect(firstRoundEnrollments.length).toBe(30);
        expect(secondRoundEnrollments.length).toBe(30);

        expect(firstRoundEnrollments.filter(enrollment => enrollment.status === EnrollmentStatus.Success).length).toBe(30);
        expect(secondRoundEnrollments.filter(enrollment => enrollment.status === EnrollmentStatus.Success).length).toBe(30);
    }, 10000)
})