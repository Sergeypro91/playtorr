import { Logger, Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { UserModel } from './user.model';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { UserDto } from '../auth/dto/userDto';
import {
	USER_NOT_CHANGE_ERROR,
	USER_NOT_DELETE_ERROR,
	USER_WITH_TGID_EXIST_ERROR,
} from './user.constants';

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

	async getAllUsers() {
		return this.userModel.find().exec();
	}

	async editUser(email: string, userData: Partial<UserDto>) {
		if (userData.tgId) {
			const existingTgIdUser = await this.findUserByTgId(userData.tgId);

			if (existingTgIdUser && existingTgIdUser.email !== email) {
				throw new HttpException(
					USER_WITH_TGID_EXIST_ERROR,
					HttpStatus.CONFLICT,
				);
			}
		}

		try {
			return await this.userModel
				.findOneAndUpdate({ email }, userData, {
					new: true,
				})
				.exec();
		} catch (err) {
			throw new HttpException(
				USER_NOT_CHANGE_ERROR,
				HttpStatus.NOT_FOUND,
			);
		}
	}

	async deleteUser(email: string) {
		try {
			const deletedUser = await this.userModel
				.findOneAndDelete({ email })
				.exec();

			this.logger.log(`User: ${email} - deleted from DB`);

			return deletedUser;
		} catch (err) {
			throw new HttpException(
				USER_NOT_DELETE_ERROR,
				HttpStatus.NOT_FOUND,
			);
		}
	}
}
