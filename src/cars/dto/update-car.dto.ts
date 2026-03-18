import {IsNumber, IsOptional, IsString, Length} from 'class-validator';

export class  UpdateCarDto{
    @IsString({message: 'brand debe ser una cadena de texto'})
    @IsOptional()
    brand?: string;

    @IsString()
    @IsOptional()
    @Length(5,10, {message: "El modelo debe tener una longitud entre 5 y 10"})
    model?: string;

    @IsNumber()
    @IsOptional()
    year?: number;
}