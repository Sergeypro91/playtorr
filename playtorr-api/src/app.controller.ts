import {
	Controller,
	Get,
	Post,
	Session,
	Request,
	UseGuards,
} from '@nestjs/common';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/guards/jwt.guard';
import { Role } from './user/user.model';
import { Roles } from './auth/decorators/roles.decorator';
import { RolesGuard } from './auth/guards/roles.guard';
import { UserService } from './user/user.service';
import { LocalAuthGuard } from './auth/guards/local.guard';
import { AuthenticatedGuard } from './auth/guards/authenticated.guard';

@Controller()
export class AppController {
	constructor(
		private readonly appService: AppService,
		private readonly userService: UserService,
	) {}

	@Roles(Role.ADMIN)
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Get()
	async getHello() {
		const user = await this.userService.findUserByEmail('test1@mail.ru');
		return user;
	}

	// @Get('session')
	// async getSession(@Session() session: Record<string, any>) {
	// 	console.log(session);
	// 	console.log(session.id);
	// 	session.authenticate = true;
	// 	return session;
	// }

	@UseGuards(LocalAuthGuard)
	@Post('session')
	async getSession(@Request() req: any) {
		return req.user;
	}

	@UseGuards(AuthenticatedGuard)
	@Get('test')
	async checkSession(@Request() req: any) {
		return req.user;
	}
}
