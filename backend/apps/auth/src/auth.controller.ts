import { Body, Controller } from '@nestjs/common';
import { RMQRoute, RMQService, RMQValidate } from 'nestjs-rmq';
import {
	AuthSignInJwt,
	AuthSignUp,
	AuthValidateUser,
	UserSignUp,
} from '@app/common/contracts';
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
		@Body() dto: AuthSignUp.Request,
	): Promise<AuthSignUp.Response> {
		return this.rmqService.send<UserSignUp.Request, UserSignUp.Response>(
			UserSignUp.topic,
			dto,
		);
	}

	@RMQValidate()
	@RMQRoute(AuthValidateUser.topic)
	async validateUser(
		@Body() dto: AuthValidateUser.Request,
	): Promise<AuthValidateUser.Response> {
		return this.authService.validateUser(dto);
	}

	@RMQValidate()
	@RMQRoute(AuthSignInJwt.topic)
	async loginUserByJwt(
		@Body() dto: AuthSignInJwt.Request,
	): Promise<AuthSignInJwt.Response> {
		return this.authService.loginUser(this.authService.validateUser(dto));
	}
}
