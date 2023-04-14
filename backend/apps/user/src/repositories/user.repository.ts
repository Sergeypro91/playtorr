import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import {
	DBUserDto,
	EditUserDto,
	PushUserRecentViewDto,
	USER_NOT_CHANGE_ERROR,
} from '@app/common';
import { UserEntity } from '../entities';
import { User } from '../models';

@Injectable()
export class UserRepository {
	constructor(
		@InjectModel(User.name) private readonly userModel: Model<User>,
	) {}

	public async createUser(user: UserEntity) {
		const newUser = new this.userModel(user);

		await newUser.save();

		return this.findUserById(newUser.id);
	}

	public async validateUser(email: string): Promise<DBUserDto> {
		return this.userModel.findOne({ email }).exec();
	}

	public async findUserById(_id: string) {
		return this.userModel.findById({ _id }, { passwordHash: 0 }).exec();
	}

	public async findUserByEmail(email: string) {
		return this.userModel.findOne({ email }, { passwordHash: 0 }).exec();
	}

	public async findUserByTgId(tgId: number) {
		return this.userModel.findOne({ tgId }, { passwordHash: 0 }).exec();
	}

	public async findUsersByEmail(users: string[]) {
		return this.userModel
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

	public async deleteUsersByEmail(email: string) {
		return this.userModel.deleteOne({ email }).exec();
	}

	public async countUsers() {
		return await this.userModel.count().exec();
	}

	public async pushRecentView({ email, ...rest }: PushUserRecentViewDto) {
		await this.userModel
			.updateOne({ email }, { $pull: { recentViews: rest } })
			.exec();

		return this.userModel
			.updateOne({ email }, { $push: { recentViews: rest } })
			.exec();
	}
}
