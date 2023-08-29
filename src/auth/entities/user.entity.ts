import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class User {
    _id?:string;
    @Prop({required: true})
    name:string;
    @Prop({required: true})
    apellido:string;
    @Prop({minlength: 6, required: true})
    password?:string;
    @Prop({required: true, unique: true})
    email:string;
    @Prop({default: true})
    isActive:boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);