import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, SetMetadata } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UserDecorator } from './decorators/user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { UserRoleGuard } from './guards/user-role.guard';
import { RoleProtected } from './decorators/role-protected.decorator';
import { Auth } from './decorators/auth.decorator';
import { AppRoles } from './interfaces/app-roles';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  async getUser(@UserDecorator() user: any){
    console.log(user.user);
  }

  @Get('private1')
  @UseGuards(AuthGuard())
   private1(@UserDecorator() user: any){
    console.log(user);
   //private1(){
    return 'Ruta protegida';
  }

  @Get('private2')
  @UseGuards(AuthGuard(), UserRoleGuard)
  @SetMetadata('roles', ['editor'])
  private2(@UserDecorator() user: any){
    console.log(user);
   //private1(){
    return 'Ruta protegida';
  }

  @Get('private3')
  @UseGuards(AuthGuard(), UserRoleGuard)
  @RoleProtected(AppRoles.admin, AppRoles.user)
  private3(@UserDecorator() user: any){
    console.log(user);
   //private1(){
    return 'Ruta protegida';
  }

  @Get('private4')
  @Auth(AppRoles.admin, AppRoles.superuser)
  private4(@UserDecorator() user: any){
    console.log(user);
   //private1(){
    return 'Ruta protegida';
  }
  
  @Post('register')
  createUser(@Body() createUserDto:CreateUserDto){
    return this.authService.createUser(createUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto:LoginUserDto){
    return this.authService.loginUser(loginUserDto);
  }  
}
