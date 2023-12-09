import { compare, genSalt, hash } from 'bcryptjs';
import { IUser } from '@app/common/interfaces';
import { Role } from '@app/common/types';

export class UserEntity implements IUser {
	_id: string;
	role: Role;
	email: string;
	passwordHash: string;
	userName?: string;
	image?: string;

	constructor(user: Omit<IUser, 'passwordHash'>) {
		this.email = user.email;
		this.role = user.role;
		this.userName = user.userName;
		this.image = user.image;
	}

	public async setPassword(password: string) {
		const salt = await genSalt(10);
		this.passwordHash = await hash(password, salt);

		return this;
	}

	public async validatePassword(password: string) {
		return compare(password, this.passwordHash);
	}
}
