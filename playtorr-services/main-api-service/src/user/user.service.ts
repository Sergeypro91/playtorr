import {
	Logger,
	Injectable,
	NotFoundException,
	ConflictException,
	ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { Role, UserModel } from './user.model';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { EditUserDto, UserSession } from './dto/userDto';
import {
	USER_NOT_CHANGE_ERROR,
	USER_WITH_TGID_EXIST_ERROR,
} from './user.constants';
import { USER_NOT_FOUND_ERROR } from '../auth/auth.constants';

@Injectable()
export class UserService {
	logger: Logger;

	constructor(
		@InjectModel(UserModel)
		private readonly userModel: ModelType<UserModel>,
	) {
		this.logger = new Logger('UserService');
	}

	async findUserById(id: string) {
		return this.userModel.findOne({ id }).exec();
	}

	async findUserByEmail(email: string) {
		return this.userModel.findOne({ email }).exec();
	}

	async findUserByTgId(tgId: number) {
		return this.userModel.findOne({ tgId }).exec();
	}

	async getUsers(users: string[]) {
		if (!users.length) {
			return await this.userModel.find().exec();
		}

		return await this.userModel.find({ email: { $in: users } }).exec();
	}

	async editUser(editingUser: UserSession, editableUser: EditUserDto) {
		const isEditingUserAdmin = editingUser.role === Role.ADMIN;

		if (editingUser.email !== editableUser.email) {
			if (!isEditingUserAdmin) {
				throw new ForbiddenException();
			}
		}

		const editableUserEmail = editableUser.email || editingUser.email;
		const editedUser = await this.findUserByEmail(editableUserEmail);

		if (!editedUser) {
			throw new NotFoundException(USER_NOT_FOUND_ERROR);
		}

		if (editableUser.tgId) {
			const existingTgIdUser = await this.findUserByTgId(
				editableUser.tgId,
			);

			if (
				existingTgIdUser &&
				existingTgIdUser.email !== editableUser.email
			) {
				throw new ConflictException(USER_WITH_TGID_EXIST_ERROR);
			}
		}

		if (editableUser.role) {
			if (!isEditingUserAdmin) {
				throw new ForbiddenException();
			}
		}

		try {
			return await this.userModel
				.findOneAndUpdate({ email: editableUser.email }, editableUser, {
					new: true,
				})
				.exec();
		} catch (err) {
			throw new NotFoundException(USER_NOT_CHANGE_ERROR);
		}
	}

	async deleteUsers(users: string[]) {
		return await this.userModel
			.deleteMany({ email: { $in: users } })
			.exec();
	}
}
