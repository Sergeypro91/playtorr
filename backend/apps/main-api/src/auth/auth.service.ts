import {
	BadRequestException,
	Injectable,
	Logger,
	UnauthorizedException,
} from '@nestjs/common';
import { UserDto } from '@app/contracts/user.dto';
import { Role } from '@app/interfaces/user/user.interface';
import { User } from '../user/models/user.model';
import { compare } from 'bcryptjs';
import {
	ALREADY_REGISTERED_EMAIL_ERROR,
	ALREADY_REGISTERED_TGID_ERROR,
	USER_NOT_FOUND_ERROR,
	WRONG_PASSWORD_ERROR,
} from './auth.constants';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { UserEntity } from '../user/entities/user.entity';

@Injectable()
export class AuthService {
	logger: Logger;

	constructor(
		private readonly userService: UserService,
		private readonly jwtService: JwtService,
	) {
		this.logger = new Logger('AuthService');
	}

	async registerUser(dto: UserDto) {
		const existEmailUser = await this.userService.findUserBy({
			type: 'email',
			id: dto.email,
		});

		if (existEmailUser) {
			throw new BadRequestException(ALREADY_REGISTERED_EMAIL_ERROR);
		}

		if (dto.tgId) {
			const existTgIdUser = await this.userService.findUserBy({
				type: 'tgId',
				id: dto.tgId,
			});

			if (existTgIdUser) {
				throw new BadRequestException(ALREADY_REGISTERED_TGID_ERROR);
			}
		}

		return this.createUser(dto);
	}

	async createUser({ password, ...newUserData }: UserDto) {
		const usersCount = await this.userService.countUsers();
		const newUserEntity = await new UserEntity({
			...newUserData,
			role: usersCount ? Role.GUEST : Role.ADMIN,
		}).setPassword(password);

		const newUser = await this.userService.createUser(newUserEntity);

		this.logger.log(`New user: ${newUser.email} - added to DB`);

		return newUser;
	}

	async validateUser(email: string, password: string): Promise<User> {
		const user = await this.userService.findUserBy({
			type: 'email',
			id: email,
		});

		if (!user) {
			throw new UnauthorizedException(USER_NOT_FOUND_ERROR);
		}

		const isCorrectPassword = await compare(password, user.passwordHash);

		if (!isCorrectPassword) {
			throw new UnauthorizedException(WRONG_PASSWORD_ERROR);
		}

		return user;
	}

	async loginUser(user: User) {
		const { email, role } = user;

		return {
			access_token: await this.jwtService.signAsync({ email, role }),
		};
	}
}
