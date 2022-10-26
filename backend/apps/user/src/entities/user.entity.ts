import { Role, IUser } from '@app/interfaces/user/user.interface';
import { compare, genSalt, hash } from 'bcryptjs';

export class UserEntity implements IUser {
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

	constructor(user: Omit<IUser, 'passwordHash'>) {
		this._id = user._id;
		this.__v = user.__v;
		this.createdAt = user.createdAt;
		this.updatedAt = user.updatedAt;
		this.email = user.email;
		this.nickname = user.nickname;
		this.firstName = user.firstName;
		this.lastName = user.lastName;
		this.role = user.role;
		this.tgId = user.tgId;
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
