import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt'; 
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor (
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService
  ){}
  async createUser(createUserDto: CreateUserDto){
    try {
      const {password, ...userData} = createUserDto;
      const user  = this.userRepository.create({
                      password: bcrypt.hashSync(password, 10),
                      ...userData
                    })
      return await this.userRepository.save(user);

    } catch (error) {
      throw new Error('error creating user');
    }
  }

  async loginUser(loginUserDto: LoginUserDto){
    try {
      const {password, email} = loginUserDto; 
      const  user = await this.userRepository.findOne({
                      where: {email, isActive: true}, 
                      select: ['id', 'email', 'password', 'roles']
                    })

      if(!user || !bcrypt.compareSync(password, user.password))
        throw new UnauthorizedException('Invalid credentials');

      return {
        user_id: user.id, 
        email: user.email, 
        roles: user.roles,  
        token: this.jwtService.sign({user_id:user.id})
      }

    } catch (error) {
      throw new Error('error login user');      
    }
  }
}
