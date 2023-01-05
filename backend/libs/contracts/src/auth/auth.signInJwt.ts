import { LoginUserDto } from '@app/contracts';

export namespace AuthSignInJwt {
	export const topic = 'auth.jwtLogin.command';

	export class Request extends LoginUserDto {}

	export class Response extends String {}
}
