import { JWTDto, LoginUserDto } from '@app/contracts';

export namespace AuthJWTLogin {
	export const topic = 'auth.jwtLogin.command';

	export class Request extends LoginUserDto {}

	export class Response extends JWTDto {}
}
