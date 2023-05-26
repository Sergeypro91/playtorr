import { RMQRoute, RMQValidate } from 'nestjs-rmq';
import { Body, Controller } from '@nestjs/common';
import {
	UserSignUp,
	UserGetUser,
	UserEditUser,
	UserGetUsers,
	UserDeleteUser,
	UserFindUserBy,
	UserValidateUser,
	UserPushUserRecentView,
} from '@app/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@RMQValidate()
	@RMQRoute(UserSignUp.topic)
	async signUp(
		@Body() dto: UserSignUp.Request,
	): Promise<UserSignUp.Response> {
		return this.userService.signUp(dto);
	}

	@RMQValidate()
	@RMQRoute(UserValidateUser.topic)
	async validateUser(
		@Body() { email }: UserValidateUser.Request,
	): Promise<UserValidateUser.Response> | null {
		return this.userService.validateUser(email);
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
		return this.userService.findUserBy({ type, id });
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

	@RMQValidate()
	@RMQRoute(UserPushUserRecentView.topic)
	async pushRecentView(
		@Body() recentView: UserPushUserRecentView.Request,
	): Promise<UserPushUserRecentView.Response> {
		return this.userService.pushUserRecentView(recentView);
	}
}
