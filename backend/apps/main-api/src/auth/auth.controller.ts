import {
	Get,
	Req,
	Post,
	Body,
	Session,
	HttpCode,
	UseGuards,
	Controller,
} from '@nestjs/common';
import { RequestWithUserSession } from '@app/contracts/user.dto';
import { UserDto } from '@app/contracts/user.dto';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local.guard';
import { AuthenticatedGuard } from './guards/authenticated.guard';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('register')
	async registerUser(@Body() dto: UserDto) {
		return this.authService.registerUser(dto);
	}

	@UseGuards(LocalAuthGuard)
	@HttpCode(200)
	@Post('login')
	async loginUserBySession(@Session() session: Record<string, any>) {
		return session;
	}

	@UseGuards(AuthenticatedGuard)
	@Get('logout')
	async logoutUser(@Session() session: Record<string, any>) {
		session.destroy();

		return { message: 'User session end' };
	}

	@UseGuards(AuthenticatedGuard)
	@Get('checkSession')
	async check(@Req() { user }: RequestWithUserSession) {
		return user;
	}

	@HttpCode(200)
	@Post('loginJwt')
	async loginUserByJwt(@Body() { email, password }: UserDto) {
		const user = await this.authService.validateUser(email, password);

		return this.authService.loginUser(user);
	}
}
