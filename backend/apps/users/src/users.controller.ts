import { RMQRoute, RMQValidate } from 'nestjs-rmq';
import { Body, Controller } from '@nestjs/common';
import {
	UsersGetUsers,
	UsersEditUser,
	UsersCreateUser,
	UsersDeleteUser,
	UsersFindUserById,
	UsersFindUserByEmail,
	UsersGetUserUnsafeById,
	UsersGetUserUnsafeByEmail,
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
	): Promise<null | UsersFindUserById.Response> {
		return { user: await this.userService.findUserById(id) };
	}

	@RMQValidate()
	@RMQRoute(UsersFindUserByEmail.topic)
	async findUserByEmail(
		@Body() { email }: UsersFindUserByEmail.Request,
	): Promise<null | UsersFindUserByEmail.Response> {
		return { user: await this.userService.findUserByEmail(email) };
	}

	@RMQValidate()
	@RMQRoute(UsersGetUsers.topic)
	async getUsers(
		@Body() { users }: UsersGetUsers.Request,
	): Promise<UsersGetUsers.Response> {
		return { users: await this.userService.getUsers({ users }) };
	}

	@RMQValidate()
	@RMQRoute(UsersGetUserUnsafeById.topic)
	async getUserUnsafeById(
		@Body() { id }: UsersGetUserUnsafeById.Request,
	): Promise<UsersGetUserUnsafeById.Response> {
		return { user: await this.userService.getUserUnsafeById(id) };
	}

	@RMQValidate()
	@RMQRoute(UsersGetUserUnsafeByEmail.topic)
	async getUserUnsafeByEmail(
		@Body() { email }: UsersGetUserUnsafeByEmail.Request,
	): Promise<UsersGetUserUnsafeByEmail.Response> {
		return { user: await this.userService.getUserUnsafeByEmail(email) };
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
