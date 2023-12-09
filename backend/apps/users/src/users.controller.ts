import { RMQRoute, RMQValidate } from 'nestjs-rmq';
import { Body, Controller } from '@nestjs/common';
import {
	UsersGetUsers,
	UsersEditUser,
	UsersCreateUser,
	UsersDeleteUser,
	UsersFindUserById,
	UsersGetUserUnsafe,
	UsersFindUserByEmail,
} from '@app/common/contracts';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
	constructor(private readonly userService: UsersService) {}

	@RMQValidate()
	@RMQRoute(UsersCreateUser.topic)
	async createUser(
		@Body() newUser: UsersCreateUser.Request,
	): Promise<UsersCreateUser.Response> {
		return this.userService.createUser(newUser);
	}

	@RMQValidate()
	@RMQRoute(UsersFindUserById.topic)
	async findUserById(
		@Body() { id }: UsersFindUserById.Request,
	): Promise<UsersFindUserById.Response> {
		return this.userService.findUserById(id);
	}

	@RMQValidate()
	@RMQRoute(UsersFindUserByEmail.topic)
	async findUserByEmail(
		@Body() { email }: UsersFindUserByEmail.Request,
	): Promise<UsersFindUserByEmail.Response> {
		return this.userService.findUserByEmail(email);
	}

	@RMQValidate()
	@RMQRoute(UsersGetUsers.topic)
	async getUsers(
		@Body() { users }: UsersGetUsers.Request,
	): Promise<UsersGetUsers.Response[]> {
		return this.userService.getUsers({ users });
	}

	@RMQValidate()
	@RMQRoute(UsersGetUserUnsafe.topic)
	async getUserUnsafe(
		@Body() { email }: UsersGetUserUnsafe.Request,
	): Promise<UsersGetUserUnsafe.Response> {
		return this.userService.getUserUnsafe(email);
	}

	@RMQValidate()
	@RMQRoute(UsersEditUser.topic)
	async editUser(
		@Body() editableUser: UsersEditUser.Request,
	): Promise<UsersEditUser.Response> {
		return this.userService.editUser(editableUser);
	}

	@RMQValidate()
	@RMQRoute(UsersDeleteUser.topic)
	async deleteUser(
		@Body() { id }: UsersDeleteUser.Request,
	): Promise<boolean> {
		return this.userService.deleteUser(id);
	}
}
