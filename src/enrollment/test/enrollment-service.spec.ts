import {PrismaService} from "../../prisma/prisma.service";
import {Test} from "@nestjs/testing";
import {EnrollmentService} from "../application/enrollment.service";
import {EnrollmentModule} from "../enrollment.module";

describe('수강 등록 관련 기능(수강 등록, 수강 등록 조회) 테스트', () => {

    let service: EnrollmentService;


    beforeEach(async () => {
        let module = await Test.createTestingModule({
            imports: [EnrollmentModule]
        }).compile();
        service = module.get<EnrollmentService>(EnrollmentService);
    })

    it('test', () => {
        expect(service).toBeDefined();
    })

});