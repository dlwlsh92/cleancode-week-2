import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { EnrollmentModule } from "./enrollment/enrollment.module";
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [EnrollmentModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
