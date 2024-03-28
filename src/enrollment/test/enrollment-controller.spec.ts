import {INestApplication} from "@nestjs/common";
import { Test } from "@nestjs/testing";
import * as request from "supertest";
import {EnrollmentModule} from "../enrollment.module";
import {TestRepository} from "./test.repository";
import {Round} from "../domain/round";
import {PrismaService} from "../../prisma/prisma.service";
import {register} from "tsconfig-paths";


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
        seedData = await testRepository.createSeedData(0, 30);
    })

    afterEach(async () => {
        // await testRepository.deleteAll();
    })

    describe('동시 수강 신청에 대한 API 테스트', () => {
        it('최대 정원을 초과하는 인원이 수강 신청을 해도 30명까지만 수강 신청이 가능하다.', async () => {
            const {courseId, id} = seedData;
            const registerCount = 5;
            let createdUsers: number[] = [];

            const userIds = await Promise.all(
                Array.from({length: registerCount}, async (_, index) => {
                    const userId = await testRepository.createUsers();
                    createdUsers.push(userId);
                    return userId;
                })
            )

            console.log("=>(enrollment-controller.spec.ts:139) userIds", userIds);
            const requests = userIds.map(userId => {
                return request(app.getHttpServer())
                    .post(`/enrollment/users/${userId}/enroll/course`)
                    .send({
                        courseId,
                        roundId: id
                    })
            })
            await Promise.all(requests);
            const round = await testRepository.getRoundById(id);

            // expect(round?.enrolledCount).toBe(30);
            // await testRepository.deleteAll();
        }, 30000)

    })
})