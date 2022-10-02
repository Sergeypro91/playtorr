import { Req, Body, Controller } from '@nestjs/common';
import { UsersEmailDto } from '@app/contracts/createUserDto';
import { UserService } from './user.service';
import { RMQRoute, RMQValidate } from 'nestjs-rmq';
import {
	UserGetUser,
	UserGetUsers,
	UserDeleteUsers,
	UserEditUser,
} from '@app/contracts';

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

	@RMQValidate()
	@RMQRoute(UserGetUsers.topic)
	async getUsers(
		@Body() { users }: UserGetUsers.Request,
	): Promise<UserGetUsers.Response[]> {
		return this.userService.getUsers(users);
	}

	@RMQValidate()
	@RMQRoute(UserEditUser.topic)
	async editUser(
		@Body() { user, userSession }: UserEditUser.Request,
	): Promise<UserEditUser.Response> {
		return this.userService.editUser(user, userSession);
	}

	@RMQValidate()
	@RMQRoute(UserDeleteUsers.topic)
	async deleteUsers(@Body() { users }: UsersEmailDto) {
		return this.userService.deleteUsers(users);
	}
}
