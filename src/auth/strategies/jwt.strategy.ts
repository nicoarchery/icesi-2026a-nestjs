import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "../entities/user.entity";
import { Repository } from "typeorm";
import { UnauthorizedException } from "@nestjs/common";

export class JwtStrategy extends  PassportStrategy(Strategy){

    constructor (
        private readonly configService: ConfigService,
        @InjectRepository(User) private readonly userRepository: Repository<User>  

    ){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), 
            ignoreExpiration: false, 
            secretOrKey: configService.get('JWT_SECRET') || '',
        });
    }

    async validate(payload: any){
        const id = payload.user_id;
        const user = await this.userRepository.findOneBy({id});

        if(!user)
            throw new UnauthorizedException("user doesn't exists");
        else if (!(user.isActive))
            throw new UnauthorizedException("user inactive");

        const { password, ...userRet} = user; 
        
        return userRet;
    }

}