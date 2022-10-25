import {
	Get,
	Req,
	Post,
	Body,
	Session,
	HttpCode,
	UseGuards,
	Controller,
	UnauthorizedException,
	InternalServerErrorException,
} from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { Logger as PinoLogger } from 'nestjs-pino';
import {
	JWTDto,
	UserDto,
	ErrorDto,
	DBUserDto,
	LoginUserDto,
	LogoutUserDto,
	UserSessionDto,
	AuthJWTLogin,
	AuthRegister,
} from '@app/contracts';
import {
	ApiTags,
	ApiOperation,
	ApiBadRequestResponse,
	ApiUnauthorizedResponse,
	ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { RMQService } from 'nestjs-rmq';
import { LocalAuthGuard, AuthenticatedGuard } from '../guards';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
	constructor(
		private readonly rmqService: RMQService,
		private readonly pinoLogger: PinoLogger,
	) {}

	@ApiOperation({ summary: 'Регистрация пользователя' })
	@ApiInternalServerErrorResponse({ type: ErrorDto })
	@ApiBadRequestResponse({ type: ErrorDto })
	@Post('register')
	async registerUser(@Body() newUser: UserDto): Promise<DBUserDto> {
		this.pinoLogger.log(`registerUser_${uuid()}`);
		try {
			return await this.rmqService.send<
				AuthRegister.Request,
				AuthRegister.Response
			>(AuthRegister.topic, newUser);
		} catch (error) {
			if (error instanceof Error) {
				throw new InternalServerErrorException(error.message);
			}
		}
	}

	@ApiOperation({ summary: 'Сессионная авторизация пользователя' })
	@ApiUnauthorizedResponse({ type: ErrorDto })
	@ApiBadRequestResponse({ type: ErrorDto })
	@UseGuards(LocalAuthGuard)
	@HttpCode(200)
	@Post('login')
	async loginUserBySession(
		@Body() user: LoginUserDto,
		@Req() { user: userSession }: { user: UserSessionDto },
	): Promise<UserSessionDto> {
		this.pinoLogger.log(`loginUserBySession_${uuid()}`);
		return userSession;
	}

	@ApiOperation({ summary: 'Удаление сессии пользователя' })
	@ApiUnauthorizedResponse({ type: ErrorDto })
	@UseGuards(AuthenticatedGuard)
	@Get('logout')
	async logoutUser(
		@Session() session,
		@Req() { user: userSession }: { user: UserSessionDto },
	): Promise<LogoutUserDto> {
		this.pinoLogger.log(`logoutUser_${uuid()}`);
		try {
			session.destroy();
			return {
				message: `User session for - ${userSession.email} is end`,
			};
		} catch (error) {
			if (error instanceof Error) {
				throw new UnauthorizedException();
			}
		}
	}

	@ApiOperation({ summary: 'Проверка активной сессии пользователя' })
	@ApiUnauthorizedResponse({ type: ErrorDto })
	@UseGuards(AuthenticatedGuard)
	@Get('checkSession')
	async checkSession(
		@Req() { user: userSession }: { user: UserSessionDto },
	): Promise<UserSessionDto> {
		this.pinoLogger.log(`checkSession_${uuid()}`);
		return userSession;
	}

	@ApiOperation({ summary: 'JWT авторизация пользователя' })
	@ApiUnauthorizedResponse({ type: ErrorDto })
	@ApiBadRequestResponse({ type: ErrorDto })
	@HttpCode(200)
	@Post('loginJwt')
	async loginUserByJwt(
		@Body() { email, password }: LoginUserDto,
	): Promise<JWTDto> {
		this.pinoLogger.log(`loginUserByJwt_${uuid()}`);
		try {
			return await this.rmqService.send<
				AuthJWTLogin.Request,
				AuthJWTLogin.Response
			>(AuthJWTLogin.topic, { email, password });
		} catch (error) {
			if (error instanceof Error) {
				throw new UnauthorizedException(error.message);
			}
		}
	}
}
