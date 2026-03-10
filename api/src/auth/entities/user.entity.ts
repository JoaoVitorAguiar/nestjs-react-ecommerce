import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export type UserDocument = User & Document;

export type UserRole = 'admin' | 'customer';

@Schema()
export class User {
    @Prop()
    name: string;

    @Prop()
    email: string;

    @Prop()
    passwordHash: string;

    @Prop({ default: 'customer' })
    role: UserRole;
}

export const UserSchema = SchemaFactory.createForClass(User);
