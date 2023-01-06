import { Request } from 'express';
import { Role, IRecentView, UserSessionDto } from '@app/common';

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
