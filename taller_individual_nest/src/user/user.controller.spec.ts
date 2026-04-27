import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { PassportModule } from '@nestjs/passport';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  const mockUser: User = {
    id: '1',
    email: 'test@example.com',
    name: 'Test User',
  } as User;

  const mockUserService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    findByEmail: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a user using the service', async () => {
      const dto: CreateUserDto = { email: 'new@example.com', name: 'New User' } as CreateUserDto;
      mockUserService.create.mockResolvedValue({ id: '2', ...dto });

      const result = await controller.create(dto);

      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual({ id: '2', ...dto });
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      mockUserService.findAll.mockResolvedValue([mockUser]);
      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual([mockUser]);
    });
  });

  describe('findOne', () => {
    it('should return one user by id', async () => {
      mockUserService.findOne.mockResolvedValue(mockUser);
      const result = await controller.findOne('1');

      expect(service.findOne).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockUser);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const dto: UpdateUserDto = { name: 'Updated User' } as UpdateUserDto;
      const updated = { ...mockUser, ...dto };
      mockUserService.update.mockResolvedValue(updated);

      const result = await controller.update('1', dto);

      expect(service.update).toHaveBeenCalledWith('1', dto);
      expect(result).toEqual(updated);
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      mockUserService.remove.mockResolvedValue(mockUser);

      const result = await controller.remove('1');

      expect(service.remove).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockUser);
    });
  });

  describe('findByEmail', () => {
    it('should find a user by email', async () => {
      mockUserService.findByEmail.mockResolvedValue(mockUser);

      const result = await controller.findByEmail('test@example.com');

      expect(service.findByEmail).toHaveBeenCalledWith('test@example.com');
      expect(result).toEqual(mockUser);
    });
  });
});
