import {
	Get,
	Post,
	Body,
	Request,
	UsePipes,
	HttpCode,
	UseGuards,
	Controller,
	ValidationPipe,
	BadRequestException,
} from '@nestjs/common';
import { UserDto } from './dto/userDto';
import { AuthService } from './auth.service';
import { ALREADY_REGISTERED_ERROR } from './auth.constants';
import { UserService } from '../user/user.service';
import { LocalAuthGuard } from './guards/local.guard';
import { AuthenticatedGuard } from './guards/authenticated.guard';

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

	@UseGuards(LocalAuthGuard)
	@HttpCode(200)
	@Post('login')
	async login(@Body() dto: UserDto) {
		return await this.userService.findUserByEmail(dto.email);
	}

	@HttpCode(200)
	@Get('logout')
	async logout(@Request() req: any) {
		req.session.destroy();

		return { message: 'User session end' };
	}

	@UseGuards(AuthenticatedGuard)
	@Get('checkSession')
	async checkSession(@Request() req: any) {
		return req.user;
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('loginJwt')
	async loginJwt(@Body() { email, password }: UserDto) {
		const user = await this.authService.validateUser(email, password);

		return this.authService.login(user);
	}
}
