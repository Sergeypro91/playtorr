import {
	Get,
	Post,
	Body,
	Delete,
	Request,
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
	async editUser(@Body() dto: Partial<UserDto>, @Request() req: any) {
		const { email } = req.session.passport.user;
		return await this.userService.editUser(email, dto);
	}

	@UsePipes(new ValidationPipe())
	@Roles(Role.ADMIN)
	@UseGuards(AuthenticatedGuard, RolesGuard)
	@Post('editByAdmin')
	async editUserAdmin(@Body() dto: EditUserDto) {
		return await this.userService.editUser(
			dto.editUserEmail,
			dto.editUserData,
		);
	}

	@UseGuards(AuthenticatedGuard)
	@Delete('delete')
	async deleteUser(@Request() req: any) {
		const { email } = req.session.passport.user;
		return await this.userService.deleteUser(email);
	}

	@UsePipes(new ValidationPipe())
	@Roles(Role.ADMIN)
	@UseGuards(AuthenticatedGuard, RolesGuard)
	@Delete('deleteByAdmin')
	async deleteUserAdmin(@Body() dto: DeleteUserDto) {
		return await this.userService.deleteUser(dto.editUserEmail);
	}

	@Roles(Role.ADMIN)
	@UseGuards(AuthenticatedGuard, RolesGuard)
	@Get('getAllUsers')
	async getAllUsers() {
		return await this.userService.getAllUsers();
	}
}
