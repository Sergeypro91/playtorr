import { Body, Controller } from '@nestjs/common';
import { RMQRoute, RMQService, RMQValidate } from 'nestjs-rmq';
import {
	AuthSignInJwt,
	AuthSignUp,
	AuthValidateUser,
	UserSignUp,
} from '@app/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
	constructor(
		private readonly rmqService: RMQService,
		private readonly authService: AuthService,
	) {}

	@RMQValidate()
	@RMQRoute(AuthSignUp.topic)
	async signUp(
		@Body() newUser: AuthSignUp.Request,
	): Promise<AuthSignUp.Response> {
		return this.rmqService.send<UserSignUp.Request, UserSignUp.Response>(
			UserSignUp.topic,
			newUser,
		);
	}

	@RMQValidate()
	@RMQRoute(AuthValidateUser.topic)
	async validateUser(
		@Body() { email, password }: AuthValidateUser.Request,
	): Promise<AuthValidateUser.Response> {
		return this.authService.validateUser(email, password);
	}

	@RMQValidate()
	@RMQRoute(AuthSignInJwt.topic)
	async loginUserByJwt(
		@Body() { email, password }: AuthSignInJwt.Request,
	): Promise<AuthSignInJwt.Response> {
		return this.authService.loginUser(
			this.authService.validateUser(email, password),
		);
	}
}
