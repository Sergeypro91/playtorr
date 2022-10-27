import { Body, Controller, NotFoundException } from '@nestjs/common';
import { RMQRoute, RMQValidate } from 'nestjs-rmq';
import {
	UserDeleteUser,
	UserEditUser,
	UserFindUserBy,
	UserGetUser,
	UserGetUsers,
	UserRegister,
} from '@app/contracts';
import { USER_NOT_FOUND_ERROR } from '@app/constants';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@RMQValidate()
	@RMQRoute(UserRegister.topic)
	async registerUser(
		@Body() newUserData: UserRegister.Request,
	): Promise<UserRegister.Response> {
		return this.userService.registerUser(newUserData);
	}

	@RMQValidate()
	@RMQRoute(UserGetUser.topic)
	async getUser(
		@Body() { email }: UserGetUser.Request,
	): Promise<UserGetUser.Response[]> {
		return this.userService.getUsers({ users: [email] });
	}

	@RMQValidate()
	@RMQRoute(UserGetUsers.topic)
	async getUsers(
		@Body() { users }: UserGetUsers.Request,
	): Promise<UserGetUsers.Response[]> {
		return this.userService.getUsers({ users });
	}

	@RMQValidate()
	@RMQRoute(UserFindUserBy.topic)
	async findUserBy(
		@Body() { type, id }: UserFindUserBy.Request,
	): Promise<UserFindUserBy.Response> | null {
		const existUser = await this.userService.findUserBy({ type, id });

		if (!existUser) {
			throw new NotFoundException(USER_NOT_FOUND_ERROR);
		}

		return existUser;
	}

	@RMQValidate()
	@RMQRoute(UserEditUser.topic)
	async editUser(
		@Body() { editableUser, editingUser }: UserEditUser.Request,
	): Promise<UserEditUser.Response> {
		return this.userService.editUser(editableUser, editingUser);
	}

	@RMQValidate()
	@RMQRoute(UserDeleteUser.topic)
	async deleteUser(
		@Body() user: UserDeleteUser.Request,
	): Promise<UserDeleteUser.Response> {
		return this.userService.deleteUser(user);
	}
}
