import { RMQError, RMQService } from 'nestjs-rmq';
import {
	Get,
	Post,
	Patch,
	Delete,
	Controller,
	HttpException,
	Param,
	Body,
} from '@nestjs/common';
import {
	ApiTags,
	ApiOperation,
	ApiForbiddenResponse,
	ApiUnauthorizedResponse,
	ApiBadRequestResponse,
} from '@nestjs/swagger';
import {
	ErrorDto,
	UsersGetUsers,
	UsersEditUser,
	UsersDeleteUser,
	UsersFindUserById,
} from '@app/common/contracts';

@ApiTags('Users')
@Controller('users')
export class UsersController {
	constructor(private readonly rmqService: RMQService) {}

	@ApiOperation({ summary: 'Получение данных пользователя' })
	@ApiUnauthorizedResponse({ type: ErrorDto })
	@ApiBadRequestResponse({ type: ErrorDto })
	@ApiForbiddenResponse({ type: ErrorDto })
	@Get(':id')
	async getUser(@Param('id') id: string) {
		try {
			return await this.rmqService.send<
				UsersFindUserById.Request,
				UsersFindUserById.Response[]
			>(UsersFindUserById.topic, { id });
		} catch (error) {
			if (error instanceof RMQError) {
				throw new HttpException(error.message, error.code);
			}
		}
	}

	@ApiOperation({ summary: 'Получение данных пользователей' })
	@ApiUnauthorizedResponse({ type: ErrorDto })
	@ApiBadRequestResponse({ type: ErrorDto })
	@ApiForbiddenResponse({ type: ErrorDto })
	@Post()
	async getUsers(@Body() users: UsersGetUsers.Request) {
		try {
			return await this.rmqService.send<
				UsersGetUsers.Request,
				UsersGetUsers.Response[]
			>(UsersGetUsers.topic, users);
		} catch (error) {
			if (error instanceof RMQError) {
				throw new HttpException(error.message, error.code);
			}
		}
	}

	@ApiOperation({ summary: 'Редактирование данных пользователя' })
	@ApiUnauthorizedResponse({ type: ErrorDto })
	@ApiBadRequestResponse({ type: ErrorDto })
	@ApiForbiddenResponse({ type: ErrorDto })
	@Patch(':id')
	async editUser(@Body() editableUser: UsersEditUser.Request) {
		try {
			return await this.rmqService.send<
				UsersEditUser.Request,
				UsersEditUser.Response
			>(UsersEditUser.topic, editableUser);
		} catch (error) {
			if (error instanceof RMQError) {
				throw new HttpException(error.message, error.code);
			}
		}
	}

	@ApiOperation({ summary: 'Удаление пользователя' })
	@ApiUnauthorizedResponse({ type: ErrorDto })
	@ApiBadRequestResponse({ type: ErrorDto })
	@ApiForbiddenResponse({ type: ErrorDto })
	@Delete(':id')
	async deleteUser(@Param('id') id: string) {
		try {
			return await this.rmqService.send<
				UsersDeleteUser.Request,
				Promise<boolean>
			>(UsersDeleteUser.topic, { id });
		} catch (error) {
			if (error instanceof RMQError) {
				throw new HttpException(error.message, error.code);
			}
		}
	}
}
