import { Request } from 'express';
import { UserSessionDto } from '@app/contracts';
import { IRecentView } from '@app/interfaces';
import { Role } from '@app/types';

export interface IUser {
	email: string;
	role: Role;
	passwordHash: string;
	nickname?: string;
	firstName?: string;
	lastName?: string;
	tgId?: number;
	image?: string;
	recentViews?: IRecentView[];
}

export interface RequestWithUserSession extends Request {
	user: UserSessionDto;
}
