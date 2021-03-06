import { Logger, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserDto } from './dto/userDto';
import { InjectModel } from 'nestjs-typegoose';
import { Role, UserModel } from '../user/user.model';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { genSalt, hash, compare } from 'bcryptjs';
import { USER_NOT_FOUND_ERROR, WRONG_PASSWORD_ERROR } from './auth.constants';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
	logger: Logger;

	constructor(
		@InjectModel(UserModel)
		private readonly userModel: ModelType<UserModel>,
		private readonly userService: UserService,
		private readonly jwtService: JwtService,
	) {
		this.logger = new Logger('AuthService');
	}

	async createUser(dto: UserDto) {
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

		this.logger.log(`New user: ${newUser.email} - added to DB`);

		return newUser.save();
	}

	async validateUser(email: string, password: string): Promise<UserModel> {
		const user = await this.userService.findUserByEmail(email);

		if (!user) {
			throw new UnauthorizedException(USER_NOT_FOUND_ERROR);
		}

		const isCorrectPassword = await compare(password, user.passwordHash);

		if (!isCorrectPassword) {
			throw new UnauthorizedException(WRONG_PASSWORD_ERROR);
		}

		return user;
	}

	async login(user: UserModel) {
		const { email, role } = user;

		return {
			access_token: await this.jwtService.signAsync({ email, role }),
		};
	}
}
