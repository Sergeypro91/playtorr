import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
	constructor(private jwtService: JwtService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();
		const token = request.cookies['refreshToken'];

		if (!token) throw new UnauthorizedException();

		try {
			request['user'] = await this.jwtService.verifyAsync(token, {
				secret: process.env.JWT_REFRESH_SECRET,
			});
		} catch {
			throw new UnauthorizedException();
		}

		return true;
	}
}
