import { RMQRoute, RMQService, RMQValidate } from 'nestjs-rmq';
import { Body, Controller } from '@nestjs/common';
import {
	AuthLogout,
	AuthSigninLocal,
	AuthSignupLocal,
	AuthRefreshToken,
	AuthGoogleAuth,
	AuthSignupConfirmation,
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
	): Promise<string> {
		return this.authService.signupLocal(newUser);
	}

	@RMQValidate()
	@RMQRoute(AuthSignupConfirmation.topic)
	async signupConfirmation(
		@Body() activationData: AuthSignupConfirmation.Request,
	): Promise<AuthSignupConfirmation.Response> {
		return this.authService.signupConfirmation(activationData);
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
	async logout(@Body() { userId }: AuthLogout.Request): Promise<boolean> {
		return this.authService.logout(userId);
	}

	@RMQValidate()
	@RMQRoute(AuthRefreshToken.topic)
	async refreshTokens(
		@Body() { userId, refreshToken }: AuthRefreshToken.Request,
	): Promise<AuthRefreshToken.Response> {
		return this.authService.refreshTokens({ userId, refreshToken });
	}

	// GOOGLE
	@RMQValidate()
	@RMQRoute(AuthGoogleAuth.topic)
	async googleAuth(
		@Body() user: AuthGoogleAuth.Request,
	): Promise<AuthGoogleAuth.Response> {
		return this.authService.googleAuth(user);
	}
}
