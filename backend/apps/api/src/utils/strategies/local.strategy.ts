import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { RMQService } from 'nestjs-rmq';
import { AuthValidateUser } from '@app/contracts';

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
			} catch (err) {
				if (err instanceof Error) {
					throw new UnauthorizedException(err.message);
				}
			}
		};

		const user = await getUser();

		return { email: user.email, tgId: user.tgId, role: user.role };
	}
}
