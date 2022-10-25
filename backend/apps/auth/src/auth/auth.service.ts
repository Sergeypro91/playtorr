import {
	BadRequestException,
	Injectable,
	Logger,
	UnauthorizedException,
} from '@nestjs/common';
import { UserDto, DBUserDto } from '@app/contracts/user.dto';
import { Role } from '@app/interfaces/user/user.interface';
import { compare } from 'bcryptjs';
import {
	ALREADY_REGISTERED_EMAIL_ERROR,
	ALREADY_REGISTERED_TGID_ERROR,
	USER_NOT_FOUND_ERROR,
	WRONG_PASSWORD_ERROR,
} from '@app/constants/auth/auth.constants';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { UserEntity } from '../user/entities';

@Injectable()
export class AuthService {
	logger: Logger;

	constructor(
		private readonly userService: UserService,
		private readonly jwtService: JwtService,
	) {
		this.logger = new Logger(AuthService.name);
	}

	async registerUser(newUser: UserDto): Promise<DBUserDto> {
		const existEmailUser = await this.userService.findUserBy({
			type: 'email',
			id: newUser.email,
		});

		if (existEmailUser) {
			throw new BadRequestException(ALREADY_REGISTERED_EMAIL_ERROR);
		}

		if (newUser.tgId) {
			const existTgIdUser = await this.userService.findUserBy({
				type: 'tgId',
				id: `${newUser.tgId}`,
			});

			if (existTgIdUser) {
				throw new BadRequestException(ALREADY_REGISTERED_TGID_ERROR);
			}
		}

		return this.createUser(newUser);
	}

	async createUser({
		password,
		...newUserData
	}: UserDto): Promise<DBUserDto> {
		const usersCount = await this.userService.countUsers();
		const newUserEntity = await new UserEntity({
			...newUserData,
			role: usersCount ? Role.GUEST : Role.ADMIN,
		}).setPassword(password);

		const newUser = await this.userService.createUser(newUserEntity);

		this.logger.log(`New user: ${newUser.email} - added to DB`);

		return newUser;
	}

	async validateUser(email: string, password: string): Promise<DBUserDto> {
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

	async loginUser(user: DBUserDto): Promise<{ access_token: string }> {
		const { email, role } = user;

		return {
			access_token: await this.jwtService.signAsync({ email, role }),
		};
	}
}
