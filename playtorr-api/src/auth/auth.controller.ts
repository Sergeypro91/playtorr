import {
	BadRequestException,
	Body,
	Controller,
	HttpCode,
	Post,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { ALREADY_REGISTERED_ERROR } from './auth.constants';
import { runInThisContext } from 'vm';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@UsePipes(new ValidationPipe())
	@Post('register')
	async register(@Body() dto: AuthDto) {
		const oldUser = await this.authService.findUser(dto.loginName);

		if (oldUser) {
			throw new BadRequestException(ALREADY_REGISTERED_ERROR);
		}

		return this.authService.createUser(dto);
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('login')
	async login(@Body() { loginName, password }: AuthDto) {
		const { email } = await this.authService.validateUser(
			loginName,
			password,
		);

		return this.authService.login(email);
	}

	@HttpCode(200)
	@Post('logout')
	async logout(@Body() loginName: Pick<AuthDto, 'loginName'>) {}
}
