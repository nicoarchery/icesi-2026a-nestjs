import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  controllers: [AuthController],
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([User]),
    PassportModule.register({defaultStrategy: 'jwt'}),
    //JwtModule.register({secret:process.env.secret, signOptions: {expiresIn: 1000}})
    JwtModule.registerAsync({
      imports: [ConfigModule], 
      inject: [ConfigService], 
      useFactory: (configService: ConfigService) =>  (
        {
          secret: configService.get('JWT_SECRET') as string | 'secret', 
          signOptions: {expiresIn: configService.get('JWT_EXPIRES_IN')| 600}
        }
      )
    })
  ],   
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
