import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { DBUserDto } from '@app/contracts/user.dto';
import { compare } from 'bcryptjs';
import {
	USER_NOT_FOUND_ERROR,
	WRONG_PASSWORD_ERROR,
} from '@app/constants/auth/auth.constants';
import { JwtService } from '@nestjs/jwt';
import { UserFindUserBy } from '@app/contracts';
import { RMQService } from 'nestjs-rmq';

@Injectable()
export class AuthService {
	logger: Logger;

	constructor(
		private readonly jwtService: JwtService,
		private readonly rmqService: RMQService,
	) {
		this.logger = new Logger(AuthService.name);
	}

	async validateUser(email: string, password: string): Promise<DBUserDto> {
		const user = await this.rmqService.send<
			UserFindUserBy.Request,
			UserFindUserBy.Response
		>(UserFindUserBy.topic, {
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
