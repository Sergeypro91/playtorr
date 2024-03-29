import { compare, genSalt, hash } from 'bcryptjs';
import { Role, IUser, IRecentView } from '@app/common';

export class UserEntity implements IUser {
	email: string;
	passwordHash: string;
	role: Role;
	nickname?: string;
	firstName?: string;
	lastName?: string;
	tgId?: number;
	image?: string;
	recentViews?: IRecentView[];

	constructor(user: Omit<IUser, 'passwordHash'>) {
		this.email = user.email;
		this.role = user.role;
		this.nickname = user.nickname;
		this.firstName = user.firstName;
		this.lastName = user.lastName;
		this.tgId = user.tgId;
		this.image = user.image;
		this.recentViews = user.recentViews;
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
