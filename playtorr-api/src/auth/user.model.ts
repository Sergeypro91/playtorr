import { prop } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';

export type UserRole = 'guest' | 'member' | 'admin';

export enum Role {
	GUEST = 'guest',
	MEMBER = 'member',
	PREMIUM = 'premium',
	ADMIN = 'admin',
}

export interface UserModel extends Base {}
export class UserModel extends TimeStamps {
	@prop({ unique: true })
	email: string;

	@prop()
	passwordHash: string;

	@prop({ enum: Role, default: Role.GUEST })
	role: Role;

	@prop()
	image?: string;
}
