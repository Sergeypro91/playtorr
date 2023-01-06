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
	HttpStatus,
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
import { Role, RequestWithUserSession } from '@app/common';
import { RMQError, RMQService } from 'nestjs-rmq';
import {
	DBUserDto,
	EditUserDto,
	UserEmailDto,
	UsersEmailDto,
	UserSessionDto,
	ErrorDto,
	UserGetUser,
	UserGetUsers,
	UserEditUser,
	UserDeleteUser,
} from '@app/common';
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
	@HttpCode(HttpStatus.OK)
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
		@Body() editableUser: EditUserDto,
		@Req() { user: editingUser }: RequestWithUserSession,
	): Promise<DBUserDto[]> {
		this.pinoLogger.log(`editUser_${uuid()}`);
		try {
			return await this.rmqService.send<
				UserEditUser.Request,
				UserEditUser.Response[]
			>(UserEditUser.topic, {
				editableUser,
				editingUser,
			});
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
	async deleteUser(@Body() user: UserEmailDto): Promise<DBUserDto> {
		this.pinoLogger.log(`deleteUsers_${uuid()}`);
		try {
			return await this.rmqService.send<
				UserDeleteUser.Request,
				UserDeleteUser.Response
			>(UserDeleteUser.topic, user);
		} catch (error) {
			if (error instanceof RMQError) {
				throw new HttpException(error.message, error.code);
			}
		}
	}
}
