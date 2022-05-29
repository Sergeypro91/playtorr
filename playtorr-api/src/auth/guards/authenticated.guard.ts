import {
	Injectable,
	CanActivate,
	ExecutionContext,
	UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class AuthenticatedGuard implements CanActivate {
	async canActivate(context: ExecutionContext) {
		const isAuth = context.switchToHttp().getRequest().isAuthenticated();

		if (!isAuth) {
			throw new UnauthorizedException();
		}

		return isAuth;
	}
}
