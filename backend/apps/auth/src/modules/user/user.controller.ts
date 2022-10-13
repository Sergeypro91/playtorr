import { Body, Controller, NotFoundException } from '@nestjs/common';
import { UsersEmailDto } from '@app/contracts/createUser.dto';
import { UserService } from './user.service';
import { RMQRoute, RMQValidate } from 'nestjs-rmq';
import {
	UserDeleteUsers,
	UserEditUser,
	UserFindUserBy,
	UserGetUser,
	UserGetUsers,
} from '@app/contracts';
import { USER_NOT_FOUND_ERROR } from '@app/constants';

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

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
