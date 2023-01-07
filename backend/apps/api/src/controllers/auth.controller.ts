import {
	Get,
	Res,
	Req,
	Post,
	Body,
	Session,
	HttpCode,
	UseGuards,
	Controller,
	HttpException,
	HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import {
	UserDto,
	ErrorDto,
	DBUserDto,
	LoginUserDto,
	LogoutUserDto,
	UserSessionDto,
	AuthSignInJwt,
	AuthSignUp,
} from '@app/common';
import {
	ApiTags,
	ApiOperation,
	ApiBadRequestResponse,
	ApiUnauthorizedResponse,
	ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { RMQError, RMQService } from 'nestjs-rmq';
import { LocalAuthGuard, AuthenticatedGuard } from '../guards';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
	constructor(private readonly rmqService: RMQService) {}

	@ApiOperation({ summary: 'Регистрация пользователя' })
	@ApiInternalServerErrorResponse({ type: ErrorDto })
	@ApiBadRequestResponse({ type: ErrorDto })
	@Post('sign-up')
	async signUp(@Body() newUser: UserDto): Promise<DBUserDto> {
		try {
			return await this.rmqService.send<
				AuthSignUp.Request,
				AuthSignUp.Response
			>(AuthSignUp.topic, newUser);
		} catch (error) {
			if (error instanceof RMQError) {
				throw new HttpException(error.message, error.code);
			}
		}
	}

	@ApiOperation({ summary: 'Сессионная авторизация пользователя' })
	@ApiUnauthorizedResponse({ type: ErrorDto })
	@ApiBadRequestResponse({ type: ErrorDto })
	@UseGuards(LocalAuthGuard)
	@HttpCode(HttpStatus.OK)
	@Post('sign-in')
	async signIn(
		@Body() user: LoginUserDto,
		@Session() { passport }: { passport: { user: UserSessionDto } },
	): Promise<UserSessionDto> {
		return passport.user;
	}

	@ApiOperation({ summary: 'Удаление сессии пользователя' })
	@ApiUnauthorizedResponse({ type: ErrorDto })
	@UseGuards(AuthenticatedGuard)
	@Get('logout')
	async logout(@Session() session): Promise<LogoutUserDto> {
		try {
			session.destroy();
			return {
				message: `User session for - ${session.passport.user.email} is end`,
			};
		} catch (error) {
			if (error instanceof RMQError) {
				throw new HttpException(error.message, error.code);
			}
		}
	}

	@ApiOperation({ summary: 'Проверка активной сессии пользователя' })
	@ApiUnauthorizedResponse({ type: ErrorDto })
	@UseGuards(AuthenticatedGuard)
	@Get('check-in')
	async checkIn(
		@Req() { user: userSession }: { user: UserSessionDto },
	): Promise<UserSessionDto> {
		return userSession;
	}

	@ApiOperation({ summary: 'JWT авторизация пользователя' })
	@ApiUnauthorizedResponse({ type: ErrorDto })
	@ApiBadRequestResponse({ type: ErrorDto })
	@HttpCode(HttpStatus.OK)
	@Post('sign-in-jwt')
	async loginUserByJwt(
		@Res({ passthrough: true }) response: Response,
		@Body() { email, password }: LoginUserDto,
	) {
		try {
			const accessToken = await this.rmqService.send<
				AuthSignInJwt.Request,
				AuthSignInJwt.Response
			>(AuthSignInJwt.topic, { email, password });

			response.cookie('accessToken', accessToken, {
				secure: true,
				httpOnly: true,
				sameSite: true,
			});
		} catch (error) {
			if (error instanceof RMQError) {
				throw new HttpException(error.message, error.code);
			}
		}
	}
}
