import { Module } from '@nestjs/common';
import { BookService } from './book.service';
import { BookController } from './book.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { UserController } from '../user/user.controller';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [BookController, UserController],
  providers: [BookService, UserService],
  imports: [
    TypeOrmModule.forFeature([
      Book, User
    ]),
    UserModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    AuthModule
  ],
})
export class BookModule {}
