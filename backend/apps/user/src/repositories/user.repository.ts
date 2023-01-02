import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { EditUserDto, PushUserRecentViewDto } from '@app/contracts';
import { USER_NOT_CHANGE_ERROR } from '@app/constants';
import { UserEntity } from '../entities';
import { User } from '../models';

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

	async findUserById(id: string) {
		return this.userModel.findById(id).exec();
	}

	async findUserByEmail(email: string) {
		return this.userModel.findOne({ email }).exec();
	}

	async findUserByTgId(tgId: number) {
		return this.userModel.findOne({ tgId }).exec();
	}

	async getUsers(users: string[]) {
		return await this.userModel.find({ email: { $in: users } }).exec();
	}

	async updateUserData(email: string, userData: EditUserDto) {
		try {
			return await this.userModel
				.findOneAndUpdate(
					{ email },
					{ $set: userData },
					{
						new: true,
					},
				)
				.exec();
		} catch (error) {
			throw new NotFoundException(USER_NOT_CHANGE_ERROR);
		}
	}

	async pushRecentView({ email, ...rest }: PushUserRecentViewDto) {
		await this.userModel
			.updateOne({ email }, { $pull: { recentViews: rest } })
			.exec();

		return this.userModel
			.updateOne({ email }, { $push: { recentViews: rest } })
			.exec();
	}

	async deleteUsersByEmail(email: string) {
		return this.userModel.deleteOne({ email: { $in: email } }).exec();
	}
}
