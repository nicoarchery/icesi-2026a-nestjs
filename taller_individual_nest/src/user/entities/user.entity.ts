import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Book } from '../../book/entities/book.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column({ select: false })
  password: string;

  @OneToMany(() => Book, (book) => book.user)
  books: Book[];
}
