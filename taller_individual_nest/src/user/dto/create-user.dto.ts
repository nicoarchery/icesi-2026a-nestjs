import { IsEmail, IsString, Matches, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @Matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+/, {
    message: 'password must include uppercase, lowercase and number',
  })
  password: string;
}
