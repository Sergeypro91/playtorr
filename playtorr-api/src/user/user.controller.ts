import { Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
	constructor(
		// private readonly authService: AuthService,
		private readonly userService: UserService,
	) {}
	@UsePipes(new ValidationPipe())
	@Post('edit')
	async register() {
		return 'TEST';
	}
}
