import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Type } from 'class-transformer';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UserModule } from '../user/user.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtAuthGuard],
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule.register({defaultStrategy: 'jwt'}),
    JwtModule.registerAsync({
      imports: [ ConfigModule ],
      inject: [ ConfigService ],
      useFactory: ( configService: ConfigService ) => ({
          secret: 'secret',
          signOptions: {expiresIn:'20h'}
      })
    }),
    forwardRef(() => UserModule),
    PassportModule
  ],

  exports: [PassportModule, JwtModule, AuthModule]
})
export class AuthModule {}
