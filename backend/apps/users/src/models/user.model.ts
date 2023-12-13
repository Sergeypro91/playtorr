import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IUser } from '@app/common/interfaces';
import { Role } from '@app/common/types';

@Schema()
export class User
	extends Document
	implements Partial<Pick<IUser, '_id'>>, Omit<IUser, '_id'>
{
	@Prop({ required: true, enum: Role, type: String, default: Role.GUEST })
	role: Role;

	@Prop({ unique: true, required: true })
	email: string;

	@Prop({ required: true })
	passwordHash: string;

	@Prop()
	userName?: string;

	@Prop()
	image?: string;

	@Prop()
	refreshTokenHash?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
