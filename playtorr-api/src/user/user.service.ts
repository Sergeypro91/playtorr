import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { UserModel } from './user.model';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { UserDto } from '../auth/dto/userDto';
import { USER_NOT_CHANGE, USER_NOT_DELETE } from './user.constants';

@Injectable()
export class UserService {
	constructor(
		@InjectModel(UserModel)
		private readonly userModel: ModelType<UserModel>,
	) {}

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
		try {
			return await this.userModel
				.findOneAndUpdate({ email }, userData, {
					new: true,
				})
				.exec();
		} catch (err) {
			throw new HttpException(USER_NOT_CHANGE, HttpStatus.NOT_FOUND);
		}
	}

	async deleteUser(email: string) {
		try {
			return this.userModel.findOneAndDelete({ email }).exec();
		} catch (err) {
			throw new HttpException(USER_NOT_DELETE, HttpStatus.NOT_FOUND);
		}
	}
}
