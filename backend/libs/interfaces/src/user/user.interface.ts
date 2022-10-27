import { Request } from 'express';
import { UserSessionDto } from '@app/contracts';

export enum Role {
	ADMIN = 'admin',
	GUEST = 'guest',
	MEMBER = 'member',
	PREMIUM = 'premium',
	BLOCKED = 'blocked',
}

export interface IUser {
	email: string;
	role: Role;
	passwordHash: string;
	nickname?: string;
	firstName?: string;
	lastName?: string;
	tgId?: number;
	image?: string;
}

export interface RequestWithUserSession extends Request {
	user: UserSessionDto;
}
