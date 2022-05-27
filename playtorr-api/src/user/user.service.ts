import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { UserModel } from './user.model';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { UserDto } from '../auth/dto/userDto';

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

	async editUser(id: string, userData: Partial<UserDto>) {
		await this.userModel.findOneAndUpdate({ id }, userData).exec();

		return this.findUserById(id);
	}

	async deleteUser(id: string) {
		return this.userModel.findOneAndDelete({ id }).exec();
	}
}
