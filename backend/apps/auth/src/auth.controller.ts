import { Body, Controller, InternalServerErrorException } from '@nestjs/common';
import { RMQRoute, RMQService, RMQValidate } from 'nestjs-rmq';
import { AuthRegister, AuthValidateUser, UserRegister } from '@app/contracts';
import { AuthJWTLogin } from '@app/contracts';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
	constructor(
		private readonly rmqService: RMQService,
		private readonly authService: AuthService,
	) {}

	@RMQValidate()
	@RMQRoute(AuthRegister.topic)
	async registerUser(
		@Body() newUser: AuthRegister.Request,
	): Promise<AuthRegister.Response> {
		try {
			return await this.rmqService.send<
				UserRegister.Request,
				UserRegister.Response
			>(UserRegister.topic, newUser);
		} catch (error) {
			if (error instanceof Error) {
				throw new InternalServerErrorException(error.message);
			}
		}
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
