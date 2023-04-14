import { compare } from 'bcryptjs';
import { RMQService } from 'nestjs-rmq';
import { JwtService } from '@nestjs/jwt';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import {
	DBUserDto,
	UserValidateUser,
	USER_NOT_FOUND_ERROR,
	WRONG_PASSWORD_ERROR,
} from '@app/common';

@Injectable()
export class AuthService {
	logger: Logger;

	constructor(
		private readonly jwtService: JwtService,
		private readonly rmqService: RMQService,
	) {
		this.logger = new Logger(AuthService.name);
	}

	public async validateUser(
		email: string,
		password: string,
	): Promise<DBUserDto> {
		const user = await this.rmqService.send<
			UserValidateUser.Request,
			UserValidateUser.Response
		>(UserValidateUser.topic, { email });

		if (!user) {
			throw new UnauthorizedException(USER_NOT_FOUND_ERROR);
		}

		const isCorrectPassword = await compare(password, user.passwordHash);

		if (!isCorrectPassword) {
			throw new UnauthorizedException(WRONG_PASSWORD_ERROR);
		}

		return user;
	}

	public async loginUser(user: Promise<DBUserDto>): Promise<string> {
		const { email, role } = await user;

		return this.jwtService.signAsync({ email, role });
	}
}
