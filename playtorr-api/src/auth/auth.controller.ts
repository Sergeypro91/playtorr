import {
	BadRequestException,
	Body,
	Controller,
	Get,
	HttpCode,
	Post,
	Query,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { ALREADY_REGISTERED_ERROR } from './auth.constants';
import { TelegramService } from '../telegram/telegram.service';
import { TelegramUserDto } from '../telegram/dto/telegram.dto';

@Controller('auth')
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly telegramService: TelegramService,
	) {}

	@UsePipes(new ValidationPipe())
	@Post('register')
	async register(@Body() dto: AuthDto) {
		const oldUser = await this.authService.findUserByEmail(dto.loginName);

		if (oldUser) {
			throw new BadRequestException(ALREADY_REGISTERED_ERROR);
		}

		return this.authService.createUser(dto);
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('login')
	async login(@Body() { loginName, password }: AuthDto) {
		const { email, role } = await this.authService.validateUser(
			loginName,
			password,
		);

		return this.authService.login({ email, role });
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Get('telegram')
	async telegram(@Query() query: TelegramUserDto) {
		await this.telegramService.sendMessage(
			'enter',
			'Вы вошли как',
			query.id,
			query,
		);

		return query;
	}

	@HttpCode(200)
	@Post('logout')
	async logout(@Body() loginName: Pick<AuthDto, 'loginName'>) {}
}
