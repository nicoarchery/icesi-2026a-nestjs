import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from '../book/entities/book.entity';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from '../auth/auth.module';


@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [
    TypeOrmModule.forFeature([User, Book]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
})
export class UserModule {}
