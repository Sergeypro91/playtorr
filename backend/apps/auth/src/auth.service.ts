import { compare } from 'bcryptjs';
import { RMQService } from 'nestjs-rmq';
import { JwtService } from '@nestjs/jwt';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { UserFindUserBy } from '@app/contracts';
import { USER_NOT_FOUND_ERROR, WRONG_PASSWORD_ERROR } from '@app/constants';
import { User } from 'apps/user/src/models';

@Injectable()
export class AuthService {
	logger: Logger;

	constructor(
		private readonly jwtService: JwtService,
		private readonly rmqService: RMQService,
	) {
		this.logger = new Logger(AuthService.name);
	}

	public async validateUser(email: string, password: string): Promise<User> {
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

	public async loginUser(
		user: Promise<User>,
	): Promise<{ access_token: string }> {
		const { email, role } = await user;

		return {
			access_token: await this.jwtService.signAsync({ email, role }),
		};
	}
}
