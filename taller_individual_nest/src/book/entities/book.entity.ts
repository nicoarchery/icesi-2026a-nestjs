import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity('books')
export class Book {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  author: string;

  @Column({ type: 'float', default: 0 })
  price: number;

  @Column({ default: false })
  isSold: boolean;

  @ManyToOne(() => User, (user) => user.books, { nullable: true, eager: true })
  user?: User;
}
