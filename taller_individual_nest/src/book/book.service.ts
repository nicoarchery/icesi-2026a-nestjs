import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './entities/book.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { User } from '../user/entities/user.entity';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createBookDto: CreateBookDto) {
    const book = this.bookRepository.create(createBookDto);
    return this.bookRepository.save(book);
  }

  async findAll() {
    return this.bookRepository.find();
  }

  async findOne(id: string) {
    const book = await this.bookRepository.findOneBy({ id });

    if (!book) {
      throw new NotFoundException(`Book with id: ${id} not found`);
    }

    return book;
  }

  async findByAuthor(author: string) {
    return this.bookRepository.find({ where: { author } });
  }

  async markAsSold(id: string) {
    const book = await this.bookRepository.findOneBy({ id });

    if (!book) {
      throw new NotFoundException(`Book with id: ${id} not found`);
    }

    book.isSold = true;
    return this.bookRepository.save(book);
  }

  async getAvailableBooks() {
    return this.bookRepository.find({ where: { isSold: false } });
  }

  async getSoldBooks() {
    return this.bookRepository.find({ where: { isSold: true } });
  }

  async buyBook(userId: string, bookId: string) {
    const book = await this.bookRepository.findOneBy({ id: bookId });

    if (!book || book.isSold) {
      throw new NotFoundException(`Book with id: ${bookId} not available`);
    }

    const user = await this.userRepository.findOneBy({ id: userId });

    if (!user) {
      throw new NotFoundException(`User with id: ${userId} not found`);
    }

    const soldBook = await this.markAsSold(bookId);
    soldBook.user = user;

    return this.bookRepository.save(soldBook);
  }

  async update(id: string, updateBookDto: UpdateBookDto) {
    const book = await this.bookRepository.preload({ id, ...updateBookDto });

    if (!book) {
      throw new NotFoundException(`Book with id: ${id} not found`);
    }

    return this.bookRepository.save(book);
  }

  async remove(id: string) {
    const book = await this.bookRepository.findOneBy({ id });

    if (!book) {
      return;
    }

    return this.bookRepository.remove(book);
  }
}
