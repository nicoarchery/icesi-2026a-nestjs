import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  async findAll() {
    return this.userRepository.find();
  }

  async findOne(id: string) {
    return this.userRepository.findOneBy({ id });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.preload({ id, ...updateUserDto });

    if (!user) {
      throw new Error(`User with id: ${id} not found`);
    }

    return this.userRepository.save(user);
  }

  async remove(id: string) {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new Error(`User with id: ${id} not found`);
    }

    return this.userRepository.remove(user);
  }

  async findByEmail(email: string) {
    return this.userRepository.findOneBy({ email });
  }
}
