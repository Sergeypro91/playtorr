import {
	Get,
	Put,
	Req,
	Post,
	Body,
	Delete,
	UseGuards,
	Controller,
	UnauthorizedException,
} from '@nestjs/common';
import { RequestWithUserSession, Role } from '@app/interfaces';
import { EditUserDto, UsersEmailDto, UserSession } from '@app/contracts';
import { RMQService } from 'nestjs-rmq';
import {
	UserGetUser,
	UserGetUsers,
	UserEditUser,
	UserDeleteUsers,
} from '@app/contracts';
import { Roles } from '../decorators';
import { AuthenticatedGuard, RolesGuard } from '../guards';

@Controller('user')
export class UserController {
	constructor(private readonly rmqService: RMQService) {}

	@UseGuards(AuthenticatedGuard)
	@Get()
	async getUser(@Req() { user: userSession }: { user: UserSession }) {
		try {
			return await this.rmqService.send<
				UserGetUser.Request,
				UserGetUser.Response[]
			>(UserGetUser.topic, userSession);
		} catch (err) {
			if (err instanceof Error) {
				throw new UnauthorizedException(err.message);
			}
		}
	}

	@Roles(Role.ADMIN)
	@UseGuards(AuthenticatedGuard, RolesGuard)
	@Post()
	async getUsers(@Body() users: UserGetUsers.Request) {
		try {
			return await this.rmqService.send<
				UserGetUsers.Request,
				UserGetUsers.Response[]
			>(UserGetUsers.topic, users);
		} catch (err) {
			if (err instanceof Error) {
				throw new UnauthorizedException(err.message);
			}
		}
	}

	@UseGuards(AuthenticatedGuard)
	@Put()
	async editUser(
		@Req() { user: userSession }: RequestWithUserSession,
		@Body() user: EditUserDto,
	) {
		try {
			return await this.rmqService.send<
				UserEditUser.Request,
				UserEditUser.Response[]
			>(UserEditUser.topic, { user, userSession });
		} catch (err) {
			if (err instanceof Error) {
				throw new UnauthorizedException(err.message);
			}
		}
	}

	@Roles(Role.ADMIN)
	@UseGuards(AuthenticatedGuard, RolesGuard)
	@Delete()
	async deleteUsers(@Body() { users }: UsersEmailDto) {
		try {
			return await this.rmqService.send<
				UserDeleteUsers.Request,
				UserDeleteUsers.Response[]
			>(UserDeleteUsers.topic, { users });
		} catch (err) {
			if (err instanceof Error) {
				throw new UnauthorizedException(err.message);
			}
		}
	}
}
