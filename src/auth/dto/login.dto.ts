import { IsString, MinLength } from "class-validator";


export class loginDto {
    @IsString()
    name:string;

    @MinLength(6)
    password : string ;
}