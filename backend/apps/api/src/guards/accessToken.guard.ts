import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RMQService } from 'nestjs-rmq';
import { AuthRefreshToken } from '@app/common';
import { ApiService } from '../api.service';

@Injectable()
export class AccessTokenGuard implements CanActivate {
	constructor(
		private rmqService: RMQService,
		private jwtService: JwtService,
		private apiService: ApiService,
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();
		const response = context.switchToHttp().getResponse();
		const refreshToken = request.cookies['refreshToken'];
		let accessToken = request.cookies['accessToken'];

		if (!accessToken && refreshToken) {
			try {
				const user = await this.jwtService.verifyAsync(refreshToken, {
					secret: process.env.JWT_REFRESH_SECRET,
				});
				const tokens = await this.rmqService.send<
					AuthRefreshToken.Request,
					AuthRefreshToken.Response
				>(AuthRefreshToken.topic, { userId: user.sub, refreshToken });
				this.apiService.setCookies({ response, tokens });
				accessToken = tokens.accessToken;
			} catch (error) {
				throw new UnauthorizedException();
			}
		}

		if (!accessToken) throw new UnauthorizedException();

		try {
			request.user = await this.jwtService.verifyAsync(accessToken, {
				secret: process.env.JWT_SECRET,
			});
		} catch {
			throw new UnauthorizedException();
		}

		return true;
	}
}
