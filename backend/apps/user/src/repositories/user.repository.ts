import { InjectModel } from '@nestjs/mongoose';
import { User } from '../models';
import { Model } from 'mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { UserEntity } from '../entities';
import { EditUserDto, UserEmailDto } from '@app/contracts';
import { USER_NOT_CHANGE_ERROR } from '@app/constants';

@Injectable()
export class UserRepository {
	constructor(
		@InjectModel(User.name) private readonly userModel: Model<User>,
	) {}

	async countUsers() {
		return await this.userModel.count().exec();
	}

	async createUser(user: UserEntity) {
		const newUser = new this.userModel(user);

		return newUser.save();
	}

	async findUserByEmail(email: string) {
		return this.userModel.findOne({ email }).exec();
	}

	async findUserById(id: string) {
		return this.userModel.findById(id).exec();
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

	async updateUserData(email: string, userData: EditUserDto) {
		try {
			return await this.userModel
				.findOneAndUpdate({ email }, userData, {
					new: true,
				})
				.exec();
		} catch (error) {
			throw new NotFoundException(USER_NOT_CHANGE_ERROR);
		}
	}

	async deleteUsersByEmail(email: string) {
		return this.userModel.deleteOne({ email: { $in: email } }).exec();
	}
}
