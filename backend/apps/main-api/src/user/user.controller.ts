import {
	Get,
	Put,
	Req,
	Post,
	Body,
	Delete,
	UseGuards,
	Controller,
} from '@nestjs/common';
import { Role } from '@app/interfaces/user/user.interface';
import {
	EditUserDto,
	UsersEmailDto,
	RequestWithUserSession,
} from '@app/contracts/user.dto';
import { UserService } from './user.service';
import { AuthenticatedGuard } from '../auth/guards/authenticated.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { RMQRoute, RMQValidate } from 'nestjs-rmq';
import { UserGetUser } from '@app/contracts/user/user.getUser';

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@RMQValidate()
	@RMQRoute(UserGetUser.topic)
	async getUser(
		@Req() user: UserGetUser.Request,
	): Promise<UserGetUser.Response[]> {
		return this.userService.getUsers([user.email]);
	}

	@Roles(Role.ADMIN)
	@UseGuards(AuthenticatedGuard, RolesGuard)
	@Post()
	async getUsers(@Body() { users }: UsersEmailDto) {
		return this.userService.getUsers(users);
	}

	@UseGuards(AuthenticatedGuard)
	@Put()
	async editUser(
		@Req() { user }: RequestWithUserSession,
		@Body() dto: EditUserDto,
	) {
		return this.userService.editUser(user, dto);
	}

	@Roles(Role.ADMIN)
	@UseGuards(AuthenticatedGuard, RolesGuard)
	@Delete()
	async deleteUsers(@Body() { users }: UsersEmailDto) {
		return this.userService.deleteUsers(users);
	}
}
