import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { EditableUserDto, UserDto } from '@app/common/contracts';
import { USER_NOT_CHANGE_ERROR } from '@app/common/constants';
import { UserEntity } from '../entities';
import { User } from '../models';

@Injectable()
export class UserRepository {
	constructor(
		@InjectModel(User.name) private readonly userModel: Model<User>,
	) {}

	public async create(user: UserEntity) {
		const newUser = new this.userModel(user);

		await newUser.save();

		return this.findOneById(newUser.id);
	}

	public async findOneById(id: string) {
		return this.userModel.findById({ _id: id }).lean().exec();
	}

	public async findOneByEmail(email: string): Promise<null | UserDto> {
		return this.userModel.findOne({ email }).lean().exec();
	}

	public async findManyByEmail(users: string[]) {
		return this.userModel
			.find({ email: { $in: users } }, { passwordHash: 0 })
			.lean()
			.exec();
	}

	public async update({ _id, ...userData }: EditableUserDto) {
		try {
			return await this.userModel
				.findOneAndUpdate(
					{ _id },
					{ $set: userData },
					{
						new: true,
					},
				)
				.lean()
				.exec();
		} catch (error) {
			throw new NotFoundException(USER_NOT_CHANGE_ERROR);
		}
	}

	public async delete(id: string) {
		return this.userModel
			.deleteOne({
				_id: id,
			})
			.exec();
	}

	public async count() {
		return await this.userModel.count().exec();
	}
}
