import { Request, Response } from 'express';
import { RMQError, RMQService } from 'nestjs-rmq';
import {
	Req,
	Res,
	Get,
	Post,
	Body,
	HttpCode,
	UseGuards,
	HttpStatus,
	Controller,
	HttpException,
} from '@nestjs/common';
import {
	ApiTags,
	ApiOperation,
	ApiBadRequestResponse,
	ApiUnauthorizedResponse,
	ApiForbiddenResponse,
} from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import {
	ErrorDto,
	TokensDto,
	ActivationDto,
	SignupLocalDto,
	SigninLocalDto,
	AuthLogout,
	AuthGoogleAuth,
	AuthSigninLocal,
	AuthSignupLocal,
	AuthRefreshToken,
	AuthSignupConfirmation,
} from '@app/common/contracts';
import {
	GoogleAuthGuard,
	AccessTokenGuard,
	RefreshTokenGuard,
} from '../guards';
import { CurrentUser } from '../decorators';
import { ApiService } from '../api.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
	constructor(
		private readonly configService: ConfigService,
		private readonly rmqService: RMQService,
		private readonly apiService: ApiService,
	) {}

	@ApiOperation({ summary: 'Регистрация пользователя' })
	@ApiUnauthorizedResponse({ type: ErrorDto })
	@ApiBadRequestResponse({ type: ErrorDto })
	@ApiForbiddenResponse({ type: ErrorDto })
	@HttpCode(HttpStatus.OK)
	@Post('local/signup')
	async signupLocal(@Body() newUser: SignupLocalDto): Promise<string> {
		try {
			return await this.rmqService.send<
				AuthSignupLocal.Request,
				Promise<string>
			>(AuthSignupLocal.topic, newUser);
		} catch (error) {
			if (error instanceof RMQError) {
				throw new HttpException(error.message, error.code);
			}
		}
	}

	@ApiOperation({ summary: 'Подтверждение регистрации пользователя' })
	@ApiUnauthorizedResponse({ type: ErrorDto })
	@ApiBadRequestResponse({ type: ErrorDto })
	@ApiForbiddenResponse({ type: ErrorDto })
	@HttpCode(HttpStatus.CREATED)
	@Post('local/signup/confirmation')
	async signupConfirmation(
		@Body() activationData: ActivationDto,
		@Res({ passthrough: true }) response: Response,
	): Promise<TokensDto> {
		try {
			const tokens = await this.rmqService.send<
				AuthSignupConfirmation.Request,
				AuthSignupConfirmation.Response
			>(AuthSignupConfirmation.topic, activationData);

			this.apiService.setCookies({ response, tokens });

			return tokens;
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
	@HttpCode(HttpStatus.OK)
	@Post('local/signin')
	async signinLocal(
		@Body() credentials: SigninLocalDto,
		@Res({ passthrough: true }) response: Response,
	): Promise<TokensDto> {
		try {
			const tokens = await this.rmqService.send<
				AuthSigninLocal.Request,
				AuthSigninLocal.Response
			>(AuthSigninLocal.topic, credentials);

			this.apiService.setCookies({ response, tokens });

			return tokens;
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
	@UseGuards(AccessTokenGuard)
	@HttpCode(HttpStatus.OK)
	@Post('logout')
	async logout(
		@Req() request: Request,
		@Res({ passthrough: true }) response: Response,
		@CurrentUser('sub') userId: string,
	) {
		try {
			await this.rmqService.send<AuthLogout.Request, Promise<boolean>>(
				AuthLogout.topic,
				{ userId },
			);

			response.clearCookie('accessToken');
			response.clearCookie('refreshToken');

			return true;
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
	@UseGuards(RefreshTokenGuard)
	@HttpCode(HttpStatus.OK)
	@Post('refresh')
	async refreshTokens(
		@Req() request: Request,
		@Res({ passthrough: true }) response: Response,
		@CurrentUser('sub') userId: string,
		// @GetCurrentUser('refreshToken') refreshToken: string,
	): Promise<TokensDto> {
		const refreshToken = request.cookies['refreshToken'];

		try {
			const tokens = await this.rmqService.send<
				AuthRefreshToken.Request,
				AuthRefreshToken.Response
			>(AuthRefreshToken.topic, { userId, refreshToken });

			this.apiService.setCookies({ response, tokens });

			return tokens;
		} catch (error) {
			if (error instanceof RMQError) {
				throw new HttpException(error.message, error.code);
			}
		}
	}

	// GOOGLE AUTH
	@ApiOperation({ summary: 'Авторизация через Google' })
	@ApiUnauthorizedResponse({ type: ErrorDto })
	@ApiBadRequestResponse({ type: ErrorDto })
	@ApiForbiddenResponse({ type: ErrorDto })
	@UseGuards(GoogleAuthGuard)
	@Get('google')
	async signinGoogle() {
		return;
	}

	@ApiOperation({ summary: 'Callback для Google' })
	@ApiUnauthorizedResponse({ type: ErrorDto })
	@ApiBadRequestResponse({ type: ErrorDto })
	@ApiForbiddenResponse({ type: ErrorDto })
	@UseGuards(GoogleAuthGuard)
	@Get('google/redirect')
	async googleRedirect(@Req() { user }, @Res() response) {
		try {
			const clientUrl = this.configService.get('CLIENT_URL', '');
			const tokens = await this.rmqService.send<
				AuthGoogleAuth.Request,
				AuthGoogleAuth.Response
			>(AuthGoogleAuth.topic, user);

			this.apiService.setCookies({ response, tokens });
			response.redirect(clientUrl);

			return;
		} catch (error) {
			if (error instanceof RMQError) {
				throw new HttpException(error.message, error.code);
			}
		}
	}
}
