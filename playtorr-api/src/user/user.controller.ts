import {
	Body,
	Controller,
	Delete,
	HttpException,
	HttpStatus,
	Param,
	Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { IdValidationPipe } from '../pipes/id-validation.pipe';
import { UserDto } from '../auth/dto/userDto';
import { USER_NOT_CHANGE, USER_NOT_DELETE } from './user.constants';

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	// @Roles(Role.ADMIN)
	// @UseGuards(JwtAuthGuard, RolesGuard)
	@Post(':id')
	async editUser(
		@Param('id', IdValidationPipe) id: string,
		@Body() dto: Partial<UserDto>,
	) {
		const editedUser = await this.userService.editUser(id, dto);

		if (!editedUser) {
			throw new HttpException(USER_NOT_CHANGE, HttpStatus.NOT_FOUND);
		}

		return editedUser;
	}

	// @Roles(Role.ADMIN)
	// @UseGuards(JwtAuthGuard, RolesGuard)
	@Delete(':id')
	async deleteUser(
		@Param('id', IdValidationPipe) id: string,
		@Body() dto: Partial<UserDto>,
	) {
		const deletedUser = await this.userService.deleteUser(id);

		if (!deletedUser) {
			throw new HttpException(USER_NOT_DELETE, HttpStatus.NOT_FOUND);
		}

		return deletedUser;
	}
}
