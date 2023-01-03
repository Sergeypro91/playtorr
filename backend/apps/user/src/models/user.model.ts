import { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IUser } from '@app/interfaces';
import { Role } from '@app/types';
import { RecentView, RecentViewSchema } from './recentView.model';

@Schema()
export class User extends Document implements IUser {
	@Prop({ unique: true, required: true })
	email: string;

	@Prop({ required: true })
	passwordHash: string;

	@Prop()
	nickname?: string;

	@Prop()
	firstName?: string;

	@Prop()
	lastName?: string;

	@Prop()
	tgId?: number;

	@Prop({ required: true, enum: Role, type: String, default: Role.GUEST })
	role: Role;

	@Prop()
	image?: string;

	@Prop({ type: [RecentViewSchema], default: [] })
	recentViews?: Types.Array<RecentView>;
}

export const UserSchema = SchemaFactory.createForClass(User);
