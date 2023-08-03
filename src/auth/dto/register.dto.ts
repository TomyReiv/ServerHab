import { IsNumber, IsString, MinLength } from "class-validator";

export class RegisterDto {
    @IsString()
    name:string;
    @IsString()
    apellido:string;
    @MinLength(6)
    password:string;
    @IsString()
    legajo:string;
}
