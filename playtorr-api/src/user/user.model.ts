import { prop } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';

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

	@prop()
	nickname?: string;

	@prop()
	firstName?: string;

	@prop()
	lastName?: string;

	@prop({
		unique: true,
		sparse: true,
		default: null,
	})
	tgId?: number;

	@prop({ enum: Role, default: Role.GUEST })
	role: Role;

	@prop()
	image?: string;
}
