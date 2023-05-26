import { compare } from 'bcryptjs';
import { RMQService } from 'nestjs-rmq';
import { JwtService } from '@nestjs/jwt';
import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import {
	DBUserDto,
	UserValidateUser,
	LoginUserDto,
} from '@app/common/contracts';
import {
	ApiError,
	USER_NOT_FOUND_ERROR,
	WRONG_PASSWORD_ERROR,
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

	public async validateUser({
		email,
		password,
	}: LoginUserDto): Promise<DBUserDto> {
		const user = await this.rmqService.send<
			UserValidateUser.Request,
			UserValidateUser.Response
		>(UserValidateUser.topic, { email });

		if (!user) {
			throw new ApiError(HttpStatus.NOT_FOUND, USER_NOT_FOUND_ERROR);
		}

		const isCorrectPassword = await compare(password, user.passwordHash);

		if (!isCorrectPassword) {
			throw new ApiError(HttpStatus.UNAUTHORIZED, WRONG_PASSWORD_ERROR);
		}

		return user;
	}

	public async loginUser(user: Promise<DBUserDto>): Promise<string> {
		const { email, role } = await user;

		return this.jwtService.signAsync({ email, role });
	}
}
