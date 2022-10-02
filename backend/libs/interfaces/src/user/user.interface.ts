import { Request } from 'express';
import { UserSession } from '@app/contracts';

export enum Role {
	ADMIN = 'admin',
	GUEST = 'guest',
	MEMBER = 'member',
	PREMIUM = 'premium',
	BLOCKED = 'blocked',
}

export interface IUser {
	_id?: string;
	__v?: number;
	createdAt?: string;
	updatedAt?: string;
	email: string;
	passwordHash: string;
	nickname?: string;
	firstName?: string;
	lastName?: string;
	role: Role;
	tgId?: number;
	image?: string;
}

export interface RequestWithUserSession extends Request {
	user: UserSession;
}
