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

	public async countUsers() {
		return await this.userModel.count().exec();
	}

	public async createUser(user: UserEntity) {
		const newUser = new this.userModel(user);

		return newUser.save();
	}

	public async findUserById(id: string) {
		return this.userModel.findById(id).exec();
	}

	public async findUserByEmail(email: string) {
		return this.userModel.findOne({ email }).exec();
	}

	public async findUserByTgId(tgId: number) {
		return this.userModel.findOne({ tgId }).exec();
	}

	public async getUsers(users: string[]) {
		return await this.userModel
			.find({ email: { $in: users } }, { passwordHash: 0 })
			.exec();
	}

	public async updateUserData(email: string, userData: EditUserDto) {
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

	public async pushRecentView({ email, ...rest }: PushUserRecentViewDto) {
		await this.userModel
			.updateOne({ email }, { $pull: { recentViews: rest } })
			.exec();

		return this.userModel
			.updateOne({ email }, { $push: { recentViews: rest } })
			.exec();
	}

	public async deleteUsersByEmail(email: string) {
		return this.userModel.deleteOne({ email: { $in: email } }).exec();
	}
}
