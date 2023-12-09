import { compare } from 'bcryptjs';
import { RMQError, RMQService } from 'nestjs-rmq';
import { JwtService } from '@nestjs/jwt';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import {
	RefreshToken,
	SigninLocalDto,
	SignupLocalDto,
	UsersCreateUser,
	UsersGetUserUnsafe,
} from '@app/common/contracts';
import {
	ApiError,
	WRONG_PASSWORD_ERROR,
	WRONG_CREDENTIALS_ERROR,
} from '@app/common/constants';

@Injectable()
export class AuthService {
	logger: Logger;

	constructor(
		private readonly jwtService: JwtService,
		private readonly rmqService: RMQService,
	) {
		this.logger = new Logger(AuthService.name);
	}

	public async signupLocal(newUser: SignupLocalDto) {
		return this.rmqService.send<
			UsersCreateUser.Request,
			UsersCreateUser.Response
		>(UsersCreateUser.topic, newUser);
	}

	public async signinLocal({ email, password }: SigninLocalDto) {
		const { passwordHash, ...user } = await this.rmqService.send<
			UsersGetUserUnsafe.Request,
			UsersGetUserUnsafe.Response
		>(UsersGetUserUnsafe.topic, { email });

		if (!user) {
			throw new ApiError(
				HttpStatus.UNAUTHORIZED,
				WRONG_CREDENTIALS_ERROR,
			);
		}

		const isCorrectPassword = await compare(password, passwordHash);

		if (!isCorrectPassword) {
			throw new ApiError(HttpStatus.UNAUTHORIZED, WRONG_PASSWORD_ERROR);
		}

		return user;
	}

	public async logout() {
		return 'logout';
	}

	public async refreshTokens() {
		return 'refreshToken';
	}
}
