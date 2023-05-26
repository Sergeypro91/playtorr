import { LoginUserDto } from '../dtos';

export namespace AuthSignInJwt {
	export const topic = 'auth.jwtLogin.command';

	export class Request extends LoginUserDto {}

	export class Response extends String {}
}
