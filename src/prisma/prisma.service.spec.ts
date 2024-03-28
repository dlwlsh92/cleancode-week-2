import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from './prisma.service';

describe('PrismaService', () => {
  let service: PrismaService = new PrismaService();

  // beforeEach(async () => {
  //   const module: TestingModule = await Test.createTestingModule({
  //     providers: [PrismaService],
  //   }).compile();
  //
  //   service = module.get<PrismaService>(PrismaService);
  // });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });


  it('test', async () => {
    await service.users.create({
      data: {
        name: 'Alice',
        email: 'test',
        password: 'test',
      }
    })
    const users = await service.users.findUnique({
        where: { email: 'test' }
    })
    if (!users) {
        throw new Error('User not found')
    }
    expect(users.name).toBe('Alice')
  })
});
