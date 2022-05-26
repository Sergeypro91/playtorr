import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { InjectModel } from 'nestjs-typegoose';
import { Role, UserModel } from './user.model';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { genSalt, hash, compare } from 'bcryptjs';
import { USER_NOT_FOUND_ERROR, WRONG_PASSWORD_ERROR } from './auth.constants';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
	constructor(
		@InjectModel(UserModel)
		private readonly userModel: ModelType<UserModel>,
		private readonly jwtService: JwtService,
	) {}

	async createUser(dto: AuthDto) {
		const salt = await genSalt(10);
		const usersCount = await this.userModel.count().exec();
		const newUser = new this.userModel({
			email: dto.email,
			passwordHash: await hash(dto.password, salt),
			nickname: dto.nickname,
			firstName: dto.firstName,
			lastName: dto.lastName,
			tgId: dto.tgId,
			role: dto.role,
			image: dto.image,
		});

		if (!usersCount) {
			newUser.role = Role.ADMIN;
		}

		return newUser.save();
	}

	async findUserByEmail(email: string) {
		return this.userModel.findOne({ email }).exec();
	}

	async findUserByTgId(tgId: string) {
		return this.userModel.findOne({ tgId }).exec();
	}

	async validateUser(
		email: string,
		password: string,
	): Promise<Pick<UserModel, 'email' | 'role'>> {
		const user = await this.findUserByEmail(email);

		if (!user) {
			throw new UnauthorizedException(USER_NOT_FOUND_ERROR);
		}

		const isCorrectPassword = await compare(password, user.passwordHash);

		if (!isCorrectPassword) {
			throw new UnauthorizedException(WRONG_PASSWORD_ERROR);
		}

		return { email: user.email, role: user.role };
	}

	async login({ email, role }: Pick<UserModel, 'email' | 'role'>) {
		const payload = { email, role };

		return {
			access_token: await this.jwtService.signAsync(payload),
		};
	}
}
