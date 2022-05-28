import {
	BadRequestException,
	Post,
	Body,
	UsePipes,
	HttpCode,
	Controller,
	ValidationPipe,
} from '@nestjs/common';
import { UserDto } from './dto/userDto';
import { AuthService } from './auth.service';
import { ALREADY_REGISTERED_ERROR } from './auth.constants';
import { UserService } from '../user/user.service';

@Controller('auth')
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly userService: UserService,
	) {}

	@UsePipes(new ValidationPipe())
	@Post('register')
	async register(@Body() dto: UserDto) {
		const oldUser = await this.userService.findUserByEmail(dto.email);

		if (oldUser) {
			throw new BadRequestException(ALREADY_REGISTERED_ERROR);
		}

		return this.authService.createUser(dto);
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('login')
	async login(@Body() { email, password }: UserDto) {
		const user = await this.authService.validateUser(email, password);

		return this.authService.login(user);
	}

	@HttpCode(200)
	@Post('logout')
	async logout(@Body() email: Pick<UserDto, 'email'>) {}
}
