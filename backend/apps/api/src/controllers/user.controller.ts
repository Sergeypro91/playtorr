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
import { Role } from '@app/interfaces/user/user.interface';
import {
	EditUserDto,
	UsersEmailDto,
	RequestWithUserSession,
} from '@app/contracts/user.dto';
import { AuthenticatedGuard } from '../guards/authenticated.guard';
import { Roles } from '../decorators/roles.decorator';
import { RolesGuard } from '../guards/roles.guard';
import { RMQService } from 'nestjs-rmq';
import { UserGetUser } from '@app/contracts/user/user.getUser';

@Controller('user')
export class UserController {
	constructor(private readonly rmqService: RMQService) {}

	@UseGuards(AuthenticatedGuard)
	@Get()
	async getUser(@Req() { user }: { user: UserGetUser.Request }) {
		try {
			return await this.rmqService.send<
				UserGetUser.Request,
				UserGetUser.Response[]
			>(UserGetUser.topic, user);
		} catch (err) {
			if (err instanceof Error) {
				throw new UnauthorizedException(err.message);
			}
		}
	}

	@Roles(Role.ADMIN)
	@UseGuards(AuthenticatedGuard, RolesGuard)
	@Post()
	async getUsers(@Body() { users }: UsersEmailDto) {}

	@UseGuards(AuthenticatedGuard)
	@Put()
	async editUser(
		@Req() { user }: RequestWithUserSession,
		@Body() dto: EditUserDto,
	) {}

	@Roles(Role.ADMIN)
	@UseGuards(AuthenticatedGuard, RolesGuard)
	@Delete()
	async deleteUsers(@Body() { users }: UsersEmailDto) {}
}
