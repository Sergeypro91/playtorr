import { RMQRoute, RMQService, RMQValidate } from 'nestjs-rmq';
import { Body, Controller } from '@nestjs/common';
import {
	AuthLogout,
	AuthSigninLocal,
	AuthSignupLocal,
	AuthRefreshToken,
} from '@app/common/contracts';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
	constructor(
		private readonly rmqService: RMQService,
		private readonly authService: AuthService,
	) {}

	@RMQValidate()
	@RMQRoute(AuthSignupLocal.topic)
	async signupLocal(
		@Body() newUser: AuthSignupLocal.Request,
	): Promise<AuthSignupLocal.Response> {
		return this.authService.signupLocal(newUser);
	}

	@RMQValidate()
	@RMQRoute(AuthSigninLocal.topic)
	async signinLocal(
		@Body() credentials: AuthSigninLocal.Request,
	): Promise<AuthSigninLocal.Response> {
		return this.authService.signinLocal(credentials);
	}

	@RMQValidate()
	@RMQRoute(AuthLogout.topic)
	async logout() {
		return this.authService.logout();
	}

	@RMQValidate()
	@RMQRoute(AuthRefreshToken.topic)
	async refreshTokens() {
		return this.authService.refreshTokens();
	}
}
