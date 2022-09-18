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
import { UserService } from './user.service';
import { AuthenticatedGuard } from '../auth/guards/authenticated.guard';
import { Role } from './user.model';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import {
	EditUserDto,
	UsersEmailDto,
	RequestWithUserSession,
} from './dto/userDto';

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@UseGuards(AuthenticatedGuard)
	@Get()
	async getUser(@Req() { user }: RequestWithUserSession) {
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
		@Body() dto: EditUserDto,
		@Req() { user }: RequestWithUserSession,
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
