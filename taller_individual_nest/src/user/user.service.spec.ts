import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('UserService', () => {
  let service: UserService;
  let repository: Repository<User>;

  const mockUser: User = {
    id: '1',
    email: 'test@example.com',
    name: 'Test User',
  } as User;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOneBy: jest.fn(),
    preload: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and save a new user', async () => {
      const dto = { email: 'new@example.com', name: 'New User', password: 'password' };
      mockRepository.create.mockReturnValue(dto);
      mockRepository.save.mockResolvedValue({ id: '1', ...dto });

      const result = await service.create(dto);
      expect(mockRepository.create).toHaveBeenCalledWith(dto);
      expect(mockRepository.save).toHaveBeenCalledWith(dto);
      expect(result.id).toEqual('1');
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      mockRepository.find.mockResolvedValue([mockUser]);
      const result = await service.findAll();
      expect(result).toEqual([mockUser]);
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      mockRepository.findOneBy.mockResolvedValue(mockUser);
      const result = await service.findOne('1');
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: '1' });
      expect(result).toEqual(mockUser);
    });
  });

  describe('update', () => {
    it('should update an existing user', async () => {
      const dto = { name: 'Updated Name' };
      const updatedUser = { ...mockUser, ...dto };

      mockRepository.preload.mockResolvedValue(updatedUser);
      mockRepository.save.mockResolvedValue(updatedUser);

      const result = await service.update('1', dto);
      expect(mockRepository.preload).toHaveBeenCalledWith({ id: '1', ...dto });
      expect(mockRepository.save).toHaveBeenCalledWith(updatedUser);
      expect(result).toEqual(updatedUser);
    });

    it('should throw an error if user not found', async () => {
      mockRepository.preload.mockResolvedValue(null);
      await expect(service.update('1', { name: 'X' })).rejects.toThrow(
        'User with id: 1 not found',
      );
    });
  });

  describe('remove', () => {
    it('should remove an existing user', async () => {
      mockRepository.findOneBy.mockResolvedValue(mockUser);
      mockRepository.remove.mockResolvedValue(mockUser);

      const result = await service.remove('1');
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: '1' });
      expect(mockRepository.remove).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(mockUser);
    });

    it('should throw an error if user not found', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);
      await expect(service.remove('2')).rejects.toThrow('User with id: 2 not found');
    });
  });

  describe('findByEmail', () => {
    it('should find a user by email', async () => {
      mockRepository.findOneBy.mockResolvedValue(mockUser);
      const result = await service.findByEmail('test@example.com');
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(result).toEqual(mockUser);
    });
  });
});
