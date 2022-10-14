import {
	Get,
	Req,
	Post,
	Body,
	Session,
	HttpCode,
	UseGuards,
	Controller,
	UnauthorizedException,
} from '@nestjs/common';
import { LocalAuthGuard, AuthenticatedGuard } from '../../utils/guards';
import { AuthRegister, AuthJWTLogin } from '@app/contracts';
import { RMQService } from 'nestjs-rmq';
import { RequestWithUserSession } from '@app/interfaces';

@Controller('auth')
export class AuthController {
	constructor(private readonly rmqService: RMQService) {}

	@Post('register')
	async registerUser(@Body() dto: AuthRegister.Request) {
		try {
			return await this.rmqService.send<
				AuthRegister.Request,
				AuthRegister.Response
			>(AuthRegister.topic, dto);
		} catch (err) {
			if (err instanceof Error) {
				throw new UnauthorizedException(err.message);
			}
		}
	}

	@UseGuards(LocalAuthGuard)
	@HttpCode(200)
	@Post('login')
	async loginUserBySession(@Session() { passport: { user } }) {
		return user;
	}

	@UseGuards(AuthenticatedGuard)
	@Get('logout')
	async logoutUser(@Session() session) {
		const userMail = session.passport.user.email;

		session.destroy();

		return { message: `User session for - ${userMail} is end` };
	}

	@UseGuards(AuthenticatedGuard)
	@Get('checkSession')
	async check(@Req() { user }: RequestWithUserSession) {
		return user;
	}

	@HttpCode(200)
	@Post('loginJwt')
	async loginUserByJwt(@Body() { email, password }: AuthJWTLogin.Request) {
		try {
			return await this.rmqService.send<
				AuthJWTLogin.Request,
				AuthJWTLogin.Response
			>(AuthJWTLogin.topic, { email, password });
		} catch (err) {
			if (err instanceof Error) {
				throw new UnauthorizedException(err.message);
			}
		}
	}
}
