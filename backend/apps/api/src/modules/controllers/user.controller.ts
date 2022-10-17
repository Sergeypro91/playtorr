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
	HttpCode,
} from '@nestjs/common';
import { RequestWithUserSession, Role } from '@app/interfaces';
import { EditUserDto, UsersEmailDto, UserSessionDto } from '@app/contracts';
import { RMQService } from 'nestjs-rmq';
import {
	UserGetUser,
	UserGetUsers,
	UserEditUser,
	UserDeleteUsers,
} from '@app/contracts';
import { Roles } from '../../utils/decorators';
import { AuthenticatedGuard, RolesGuard } from '../../utils/guards';

@Controller('user')
export class UserController {
	constructor(private readonly rmqService: RMQService) {}

	@UseGuards(AuthenticatedGuard)
	@Get()
	async getUser(@Req() { user: { email } }: { user: UserSessionDto }) {
		try {
			return await this.rmqService.send<
				UserGetUser.Request,
				UserGetUser.Response[]
			>(UserGetUser.topic, { email });
		} catch (error) {
			if (error instanceof Error) {
				throw new UnauthorizedException(error.message);
			}
		}
	}

	@Roles(Role.ADMIN)
	@UseGuards(AuthenticatedGuard, RolesGuard)
	@HttpCode(200)
	@Post()
	async getUsers(@Body() users: UserGetUsers.Request) {
		try {
			return await this.rmqService.send<
				UserGetUsers.Request,
				UserGetUsers.Response[]
			>(UserGetUsers.topic, users);
		} catch (error) {
			if (error instanceof Error) {
				throw new UnauthorizedException(error.message);
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
		} catch (error) {
			if (error instanceof Error) {
				throw new UnauthorizedException(error.message);
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
		} catch (error) {
			if (error instanceof Error) {
				throw new UnauthorizedException(error.message);
			}
		}
	}
}
