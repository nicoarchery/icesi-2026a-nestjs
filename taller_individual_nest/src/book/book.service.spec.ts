import { Test, TestingModule } from '@nestjs/testing';
import { BookService } from './book.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './entities/book.entity';
import { User } from '../user/entities/user.entity';
import { NotFoundException } from '@nestjs/common';

describe('BookService', () => {
  let service: BookService;
  let bookRepository: Repository<Book>;
  let userRepository: Repository<User>;

  const mockBook: Book = {
    id: '1',
    title: 'Book Title',
    author: 'Author Name',
    isSold: false,
  } as Book;

  const mockUser: User = {
    id: '10',
    email: 'user@example.com',
    name: 'User Test',
  } as User;

  const mockBookRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOneBy: jest.fn(),
    preload: jest.fn(),
    remove: jest.fn(),
  };

  const mockUserRepository = {
    findOneBy: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookService,
        {
          provide: getRepositoryToken(Book),
          useValue: mockBookRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<BookService>(BookService);
    bookRepository = module.get<Repository<Book>>(getRepositoryToken(Book));
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and save a book', async () => {
      const dto = { title: 'New Book', author: 'Someone' };
      mockBookRepository.create.mockReturnValue(dto);
      mockBookRepository.save.mockResolvedValue({ id: '2', ...dto });

      const result = await service.create(dto as any);
      expect(bookRepository.create).toHaveBeenCalledWith(dto);
      expect(bookRepository.save).toHaveBeenCalledWith(dto);
      expect(result).toEqual({ id: '2', ...dto });
    });
  });

  describe('findAll', () => {
    it('should return all books', async () => {
      mockBookRepository.find.mockResolvedValue([mockBook]);
      const result = await service.findAll();
      expect(result).toEqual([mockBook]);
    });
  });

  describe('findOne', () => {
    it('should return a book by id', async () => {
      mockBookRepository.findOneBy.mockResolvedValue(mockBook);
      const result = await service.findOne('1');
      expect(result).toEqual(mockBook);
    });
  });

  describe('findByAuthor', () => {
    it('should return books by author', async () => {
      mockBookRepository.find.mockResolvedValue([mockBook]);
      const result = await service.findByAuthor('Author Name');
      expect(bookRepository.find).toHaveBeenCalledWith({ where: { author: 'Author Name' } });
      expect(result).toEqual([mockBook]);
    });
  });

  describe('markAsSold', () => {
    it('should mark a book as sold', async () => {
      mockBookRepository.findOneBy.mockResolvedValue(mockBook);
      mockBookRepository.save.mockResolvedValue({ ...mockBook, isSold: true });

      const result = await service.markAsSold('1');
      expect(bookRepository.findOneBy).toHaveBeenCalledWith({ id: '1' });
      expect(result.isSold).toBe(true);
    });

    it('should throw if book not found', async () => {
      mockBookRepository.findOneBy.mockResolvedValue(null);
      await expect(service.markAsSold('99')).rejects.toThrow(NotFoundException);
    });
  });

  describe('getAvailableBooks', () => {
    it('should return unsold books', async () => {
      mockBookRepository.find.mockResolvedValue([mockBook]);
      const result = await service.getAvailableBooks();
      expect(bookRepository.find).toHaveBeenCalledWith({ where: { isSold: false } });
      expect(result).toEqual([mockBook]);
    });
  });

  describe('getSoldBooks', () => {
    it('should return sold books', async () => {
      const soldBook = { ...mockBook, isSold: true };
      mockBookRepository.find.mockResolvedValue([soldBook]);
      const result = await service.getSoldBooks();
      expect(bookRepository.find).toHaveBeenCalledWith({ where: { isSold: true } });
      expect(result).toEqual([soldBook]);
    });
  });

  describe('buyBook', () => {
    it('should assign a user to a book and mark it as sold', async () => {
      const unsoldBook = { ...mockBook, isSold: false };
      mockBookRepository.findOneBy.mockResolvedValueOnce(unsoldBook); // for book
      mockUserRepository.findOneBy.mockResolvedValue(mockUser); // for user
      jest.spyOn(service, 'markAsSold').mockResolvedValue({ ...unsoldBook, isSold: true });
      mockBookRepository.save.mockResolvedValue({ ...unsoldBook, isSold: true, user: mockUser });

      const result = await service.buyBook('10', '1');
      expect(bookRepository.findOneBy).toHaveBeenCalledWith({ id: '1' });
      expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: '10' });
      expect(result.user).toEqual(mockUser);
      expect(result.isSold).toBe(true);
    });

    it('should throw if book not found', async () => {
      mockBookRepository.findOneBy.mockResolvedValue(null);
      await expect(service.buyBook('10', '999')).rejects.toThrow(NotFoundException);
    });

    it('should throw if book is already sold', async () => {
      const soldBook = { ...mockBook, isSold: true };
      mockBookRepository.findOneBy.mockResolvedValue(soldBook);
      await expect(service.buyBook('10', '1')).rejects.toThrow(NotFoundException);
    });

    it('should throw if user not found', async () => {
      const unsoldBook = { ...mockBook, isSold: false };
      mockBookRepository.findOneBy.mockResolvedValueOnce(unsoldBook);
      mockUserRepository.findOneBy.mockResolvedValue(null);
      await expect(service.buyBook('999', '1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update an existing book', async () => {
      const dto = { title: 'Updated Book' };
      const updated = { ...mockBook, ...dto };
      mockBookRepository.preload.mockResolvedValue(updated);
      mockBookRepository.save.mockResolvedValue(updated);

      const result = await service.update('1', dto as any);
      expect(bookRepository.preload).toHaveBeenCalledWith({ id: '1', ...dto });
      expect(result).toEqual(updated);
    });

    it('should throw if book not found', async () => {
      mockBookRepository.preload.mockResolvedValue(null);
      await expect(service.update('999', {} as any)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a book if found', async () => {
      mockBookRepository.findOneBy.mockResolvedValue(mockBook);
      mockBookRepository.remove.mockResolvedValue(mockBook);

      await service.remove('1');
      expect(bookRepository.findOneBy).toHaveBeenCalledWith({ id: '1' });
      expect(bookRepository.remove).toHaveBeenCalledWith(mockBook);
    });

    it('should not call remove if book not found', async () => {
      mockBookRepository.findOneBy.mockResolvedValue(null);
      await service.remove('999');
      expect(bookRepository.remove).not.toHaveBeenCalled();
    });
  });
});
