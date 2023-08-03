import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';

import * as bcryptjs from 'bcryptjs';

import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload';
import { LoginResponse } from './interfaces/login-response';
import { RegisterDto, loginDto, UpdateAuthDto, CreateUserDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private jwtService: JwtService
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      //Encriptar contraseña
      const { password, ...userData } = createUserDto;

      const newUser = new this.userModel({
        password: bcryptjs.hashSync(password, 10),
        ...userData,
      });

      //Guardar el usuario

      //Generar el JWT

      await newUser.save();
      const {password:_, ...user} = newUser.toJSON();

      return user;

    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException(`${createUserDto.legajo} already exists`);
      }
      throw new InternalServerErrorException('Something terrible happen');
    }
  }

  async register(registerDto: RegisterDto):Promise<LoginResponse>{
    const user = await this.create(registerDto);

    return{
      user: user,
      token: this.getJWT({ id : user._id })
    }
  }

  async login(loginDto:loginDto): Promise<LoginResponse>{
    
    const {name, password} = loginDto;

    const user = await this.userModel.findOne({name});
    if(!user){
      throw new UnauthorizedException('Not valid credentials - name');
    }

    if(!bcryptjs.compareSync(password, user.password)){
      throw new UnauthorizedException('Not valid credentials - password');
    }

    const { password:_, ...rest } = user.toJSON();

    return {
      user: rest,
      token: this.getJWT({id: user.id}),
    };
  }

  findAll(): Promise<User[]> {
    return this.userModel.find();
  }

  async findUserById(id: string){
    const user = await this.userModel.findById(id);
    const {password, ...rest} = user.toJSON();
    return user;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }

  getJWT (payload:JwtPayload){
    const token = this.jwtService.sign(payload);
    return token;
  }
}
