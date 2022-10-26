import {
	Get,
	Put,
	Req,
	Post,
	Body,
	Delete,
	HttpCode,
	UseGuards,
	Controller,
	HttpException,
} from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { Logger as PinoLogger } from 'nestjs-pino/Logger';
import {
	ApiTags,
	ApiOperation,
	ApiForbiddenResponse,
	ApiUnauthorizedResponse,
	ApiBadRequestResponse,
} from '@nestjs/swagger';
import { RequestWithUserSession, Role } from '@app/interfaces';
import {
	DBUserDto,
	EditUserDto,
	UsersEmailDto,
	UserSessionDto,
} from '@app/contracts';
import { RMQError, RMQService } from 'nestjs-rmq';
import {
	ErrorDto,
	UserGetUser,
	UserGetUsers,
	UserEditUser,
	UserDeleteUsers,
} from '@app/contracts';
import { Roles } from '../decorators';
import { AuthenticatedGuard, RolesGuard } from '../guards';

@ApiTags('User')
@Controller('user')
export class UserController {
	constructor(
		private readonly rmqService: RMQService,
		private readonly pinoLogger: PinoLogger,
	) {}

	@ApiOperation({ summary: 'Получение данных пользователя' })
	@ApiUnauthorizedResponse({ type: ErrorDto })
	@UseGuards(AuthenticatedGuard)
	@Get()
	async getUser(
		@Req() { user: { email } }: { user: UserSessionDto },
	): Promise<DBUserDto[]> {
		this.pinoLogger.log(`getUser_${uuid()}`);
		try {
			return await this.rmqService.send<
				UserGetUser.Request,
				UserGetUser.Response[]
			>(UserGetUser.topic, { email });
		} catch (error) {
			if (error instanceof RMQError) {
				throw new HttpException(error.message, error.code);
			}
		}
	}

	@ApiOperation({ summary: 'Получение данных о пользователях' })
	@ApiUnauthorizedResponse({ type: ErrorDto })
	@ApiBadRequestResponse({ type: ErrorDto })
	@ApiForbiddenResponse({ type: ErrorDto })
	@Roles(Role.ADMIN)
	@UseGuards(AuthenticatedGuard, RolesGuard)
	@HttpCode(200)
	@Post()
	async getUsers(@Body() users: UsersEmailDto): Promise<DBUserDto[]> {
		this.pinoLogger.log(`getUsers_${uuid()}`);
		try {
			return await this.rmqService.send<
				UserGetUsers.Request,
				UserGetUsers.Response[]
			>(UserGetUsers.topic, users);
		} catch (error) {
			if (error instanceof RMQError) {
				throw new HttpException(error.message, error.code);
			}
		}
	}

	@ApiOperation({ summary: 'Редактирование данных пользователя' })
	@ApiUnauthorizedResponse({ type: ErrorDto })
	@ApiBadRequestResponse({ type: ErrorDto })
	@UseGuards(AuthenticatedGuard)
	@Put()
	async editUser(
		@Body() user: EditUserDto,
		@Req() { user: userSession }: RequestWithUserSession,
	): Promise<DBUserDto[]> {
		this.pinoLogger.log(`editUser_${uuid()}`);
		try {
			return await this.rmqService.send<
				UserEditUser.Request,
				UserEditUser.Response[]
			>(UserEditUser.topic, { user, userSession });
		} catch (error) {
			if (error instanceof RMQError) {
				throw new HttpException(error.message, error.code);
			}
		}
	}

	@ApiOperation({ summary: 'Удаление пользователей' })
	@ApiUnauthorizedResponse({ type: ErrorDto })
	@ApiBadRequestResponse({ type: ErrorDto })
	@ApiForbiddenResponse({ type: ErrorDto })
	@Roles(Role.ADMIN)
	@UseGuards(AuthenticatedGuard, RolesGuard)
	@Delete()
	async deleteUsers(@Body() { users }: UsersEmailDto): Promise<DBUserDto[]> {
		this.pinoLogger.log(`deleteUsers_${uuid()}`);
		try {
			return await this.rmqService.send<
				UserDeleteUsers.Request,
				UserDeleteUsers.Response[]
			>(UserDeleteUsers.topic, { users });
		} catch (error) {
			if (error instanceof RMQError) {
				throw new HttpException(error.message, error.code);
			}
		}
	}
}
