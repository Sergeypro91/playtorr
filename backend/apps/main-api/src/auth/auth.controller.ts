import { Body, Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthRegister } from '@app/contracts';
import { RMQRoute, RMQValidate } from 'nestjs-rmq';
import { AuthValidateUser } from '@app/contracts/auth/auth.validateUser';
import { AuthJWTLogin } from '@app/contracts/auth/auth.jwtLogin';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@RMQValidate()
	@RMQRoute(AuthRegister.topic)
	async registerUser(
		@Body() dto: AuthRegister.Request,
	): Promise<AuthRegister.Response> {
		return this.authService.registerUser(dto);
	}

	@RMQValidate()
	@RMQRoute(AuthValidateUser.topic)
	async validateUser(
		@Body() { email, password }: AuthValidateUser.Request,
	): Promise<AuthValidateUser.Response> {
		return this.authService.validateUser(email, password);
	}

	@RMQValidate()
	@RMQRoute(AuthJWTLogin.topic)
	async loginUserByJwt(
		@Body() { email, password }: AuthJWTLogin.Request,
	): Promise<AuthJWTLogin.Response> {
		const user = await this.authService.validateUser(email, password);

		return this.authService.loginUser(user);
	}
}
