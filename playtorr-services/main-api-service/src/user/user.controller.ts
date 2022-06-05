import {
	Get,
	Req,
	Post,
	Body,
	Delete,
	UsePipes,
	UseGuards,
	Controller,
	ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthenticatedGuard } from '../auth/guards/authenticated.guard';
import { Role } from './user.model';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { DeleteUserDto, EditUserDto } from './dto/userDto';
import { UserDto } from '../auth/dto/userDto';

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@UsePipes(new ValidationPipe())
	@UseGuards(AuthenticatedGuard)
	@Post('edit')
	async editUser(@Body() dto: Partial<UserDto>, @Req() req: any) {
		const { email } = req.user;
		return this.userService.editUser(email, dto);
	}

	@UsePipes(new ValidationPipe())
	@Roles(Role.ADMIN)
	@UseGuards(AuthenticatedGuard, RolesGuard)
	@Post('editByAdmin')
	async editUserAdmin(@Body() dto: EditUserDto) {
		return this.userService.editUser(dto.editUserEmail, dto.editUserData);
	}

	@UseGuards(AuthenticatedGuard)
	@Delete('delete')
	async deleteUser(@Req() req: any) {
		const { email } = req.user;
		return this.userService.deleteUser(email);
	}

	@UsePipes(new ValidationPipe())
	@Roles(Role.ADMIN)
	@UseGuards(AuthenticatedGuard, RolesGuard)
	@Delete('deleteByAdmin')
	async deleteUserAdmin(@Body() dto: DeleteUserDto) {
		return this.userService.deleteUser(dto.editUserEmail);
	}

	@Roles(Role.ADMIN)
	@UseGuards(AuthenticatedGuard, RolesGuard)
	@Get('getAllUsers')
	async getAllUsers() {
		return this.userService.getAllUsers();
	}
}
