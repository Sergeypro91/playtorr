import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { RMQService } from 'nestjs-rmq';
import { AuthValidateUser } from '@app/common';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
	constructor(private readonly rmqService: RMQService) {
		super({ usernameField: 'email' });
	}

	async validate(email: string, password: string) {
		const getUser = async (): Promise<AuthValidateUser.Response> => {
			try {
				return await this.rmqService.send<
					AuthValidateUser.Request,
					AuthValidateUser.Response
				>(AuthValidateUser.topic, { email, password });
			} catch (error) {
				if (error instanceof Error) {
					throw new UnauthorizedException(error.message);
				}
			}
		};

		const user = await getUser();

		return { email: user.email, tgId: user.tgId, role: user.role };
	}
}
