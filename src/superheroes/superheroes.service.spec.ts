import { Test, TestingModule } from '@nestjs/testing';
import { SuperheroesService } from './superheroes.service';
import { PrismaService } from 'src/database/prisma.service';
import { MinioService } from 'src/minio/minio.service';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';

const mockPrismaService = {
  superhero: {
    create: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    findFirst: jest.fn(),
    delete: jest.fn(),
  },
};

const mockMinioService = {
  uploadFiles: jest.fn(),
  getPresignedUrl: jest.fn(),
  deleteFiles: jest.fn(),
};

describe('SuperheroesService', () => {
  let service: SuperheroesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SuperheroesService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: MinioService, useValue: mockMinioService },
      ],
    }).compile();

    service = module.get<SuperheroesService>(SuperheroesService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a superhero without files', async () => {
      const dto = { nickname: 'Batman' } as any;
      mockPrismaService.superhero.create.mockResolvedValue({
        id: '1',
        ...dto,
        images: [],
      });

      const result = await service.create(dto);
      expect(mockPrismaService.superhero.create).toHaveBeenCalledWith({
        data: { ...dto, images: [] },
      });
      expect(result).toEqual({ id: '1', ...dto, images: [] });
    });

    it('should create a superhero with files', async () => {
      const dto = { nickname: 'Superman' } as any;
      const files = [{ originalname: 'img1.png' }] as any;
      mockMinioService.uploadFiles.mockResolvedValue(['img1.png']);
      mockPrismaService.superhero.create.mockResolvedValue({
        id: '2',
        ...dto,
        images: ['img1.png'],
      });

      const result = await service.create(dto, files);
      expect(mockMinioService.uploadFiles).toHaveBeenCalledWith(
        dto.nickname,
        files,
      );
      expect(result.images).toContain('img1.png');
    });

    it('should throw ConflictException on duplicate nickname', async () => {
      const dto = { nickname: 'Flash' } as any;
      mockPrismaService.superhero.create.mockRejectedValue({ code: 'P2002' });

      await expect(service.create(dto)).rejects.toThrow(ConflictException);
    });

    it('should throw InternalServerErrorException on other errors', async () => {
      const dto = { nickname: 'Wonder Woman' } as any;
      mockPrismaService.superhero.create.mockRejectedValue({ code: 'OTHER' });

      await expect(service.create(dto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
