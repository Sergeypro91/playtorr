import { Role } from '@app/common/types';

export interface IUser {
	_id: string;
	role: Role;
	email: string;
	passwordHash: string;
	userName?: string;
	image?: string;
	refreshTokenHash?: string;
}
