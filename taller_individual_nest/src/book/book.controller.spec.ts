import { Test, TestingModule } from '@nestjs/testing';
import { BookController } from './book.controller';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book } from './entities/book.entity';
import { PassportModule } from '@nestjs/passport';

describe('BookController', () => {
  let controller: BookController;
  let service: BookService;

  const mockBook: Book = {
    id: '1',
    title: 'Book Title',
    author: 'Author Name',
    isSold: false,
  } as Book;

  const mockBookService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByAuthor: jest.fn(),
    getAvailableBooks: jest.fn(),
    getSoldBooks: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
      controllers: [BookController],
      providers: [
        {
          provide: BookService,
          useValue: mockBookService,
        },
      ],
    }).compile();

    controller = module.get<BookController>(BookController);
    service = module.get<BookService>(BookService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create and return result', async () => {
      const dto: CreateBookDto = { title: 'New Book', author: 'Someone' } as CreateBookDto;
      const savedBook = { id: '2', ...dto };
      mockBookService.create.mockResolvedValue(savedBook);

      const result = await controller.create(dto);
      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(savedBook);
    });
  });

  describe('findAll', () => {
    it('should return all books', async () => {
      mockBookService.findAll.mockResolvedValue([mockBook]);
      const result = await controller.findAll();
      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual([mockBook]);
    });
  });

  describe('findOne', () => {
    it('should return a book by id', async () => {
      mockBookService.findOne.mockResolvedValue(mockBook);
      const result = await controller.findOne('1');
      expect(service.findOne).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockBook);
    });
  });

  describe('findByAuthor', () => {
    it('should return books by author', async () => {
      mockBookService.findByAuthor.mockResolvedValue([mockBook]);
      const result = await controller.findByAuthor('Author Name');
      expect(service.findByAuthor).toHaveBeenCalledWith('Author Name');
      expect(result).toEqual([mockBook]);
    });
  });

  describe('getAvailableBooks', () => {
    it('should return available books', async () => {
      mockBookService.getAvailableBooks.mockResolvedValue([mockBook]);
      const result = await controller.getAvailableBooks();
      expect(service.getAvailableBooks).toHaveBeenCalled();
      expect(result).toEqual([mockBook]);
    });
  });

  describe('getSoldBooks', () => {
    it('should return sold books', async () => {
      const soldBook = { ...mockBook, isSold: true };
      mockBookService.getSoldBooks.mockResolvedValue([soldBook]);
      const result = await controller.getSoldBooks();
      expect(service.getSoldBooks).toHaveBeenCalled();
      expect(result).toEqual([soldBook]);
    });
  });

  describe('update', () => {
    it('should update a book', async () => {
      const dto: UpdateBookDto = { title: 'Updated Book' } as UpdateBookDto;
      const updated = { ...mockBook, ...dto };
      mockBookService.update.mockResolvedValue(updated);

      const result = await controller.update('1', dto);
      expect(service.update).toHaveBeenCalledWith('1', dto);
      expect(result).toEqual(updated);
    });
  });

  describe('remove', () => {
    it('should remove a book', async () => {
      mockBookService.remove.mockResolvedValue(mockBook);
      const result = await controller.remove('1');
      expect(service.remove).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockBook);
    });
  });
});
