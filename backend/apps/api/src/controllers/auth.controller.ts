import { RMQError, RMQService } from 'nestjs-rmq';
import { Get, Post, Controller, HttpException, Body } from '@nestjs/common';
import {
	ApiTags,
	ApiOperation,
	ApiBadRequestResponse,
	ApiUnauthorizedResponse,
	ApiForbiddenResponse,
} from '@nestjs/swagger';
import {
	ErrorDto,
	AuthLogout,
	AuthSigninLocal,
	AuthSignupLocal,
	AuthRefreshToken,
} from '@app/common/contracts';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
	constructor(private readonly rmqService: RMQService) {}

	@ApiOperation({ summary: 'Регистрация пользователя' })
	@ApiUnauthorizedResponse({ type: ErrorDto })
	@ApiBadRequestResponse({ type: ErrorDto })
	@ApiForbiddenResponse({ type: ErrorDto })
	@Post('local/signup')
	async signupLocal(@Body() newUser: AuthSignupLocal.Request) {
		try {
			return await this.rmqService.send<
				AuthSignupLocal.Request,
				AuthSignupLocal.Response
			>(AuthSignupLocal.topic, newUser);
		} catch (error) {
			if (error instanceof RMQError) {
				throw new HttpException(error.message, error.code);
			}
		}
	}

	@ApiOperation({ summary: 'Авторизация пользователя' })
	@ApiUnauthorizedResponse({ type: ErrorDto })
	@ApiBadRequestResponse({ type: ErrorDto })
	@ApiForbiddenResponse({ type: ErrorDto })
	@Post('local/signin')
	async signinLocal(@Body() credentials: AuthSigninLocal.Request) {
		try {
			return await this.rmqService.send<
				AuthSigninLocal.Request,
				AuthSigninLocal.Response
			>(AuthSigninLocal.topic, credentials);
		} catch (error) {
			if (error instanceof RMQError) {
				throw new HttpException(error.message, error.code);
			}
		}
	}

	@ApiOperation({ summary: 'Выход из профиля' })
	@ApiUnauthorizedResponse({ type: ErrorDto })
	@ApiBadRequestResponse({ type: ErrorDto })
	@ApiForbiddenResponse({ type: ErrorDto })
	@Get('logout')
	async logout() {
		try {
			return await this.rmqService.send<
				AuthLogout.Request,
				AuthLogout.Response
			>(AuthLogout.topic, {});
		} catch (error) {
			if (error instanceof RMQError) {
				throw new HttpException(error.message, error.code);
			}
		}
	}

	@ApiOperation({ summary: 'Обновления accessToken' })
	@ApiUnauthorizedResponse({ type: ErrorDto })
	@ApiBadRequestResponse({ type: ErrorDto })
	@ApiForbiddenResponse({ type: ErrorDto })
	@Get('refresh')
	async refreshTokens() {
		try {
			return await this.rmqService.send<
				AuthRefreshToken.Request,
				AuthRefreshToken.Response
			>(AuthRefreshToken.topic, {});
		} catch (error) {
			if (error instanceof RMQError) {
				throw new HttpException(error.message, error.code);
			}
		}
	}
}
