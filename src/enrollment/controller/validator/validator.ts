import { z } from 'zod';
import {BadRequestException, Injectable, PipeTransform} from "@nestjs/common";

const IntSchema = z.preprocess((val) => Number(val), z.number().int());

@Injectable()
export class IntValidationPipe implements PipeTransform {
    transform(value: any): any {
        const result = IntSchema.safeParse(value);
        if (!result.success) {
            throw new BadRequestException('유효한 id가 아닙니다.');
        }
        return result.data;
    }
}

const CourseDataDtoSchema = z.object({
    courseId: IntSchema,
    roundId: IntSchema,
})

@Injectable()
export class CourseDataDtoValidationPipe implements PipeTransform {
    transform(value: any): any {
        const result = CourseDataDtoSchema.safeParse(value);
        if (!result.success) {
            throw new BadRequestException('유효한 수강신청 데이터가 아닙니다.');
        }
        return result.data;
    }
}