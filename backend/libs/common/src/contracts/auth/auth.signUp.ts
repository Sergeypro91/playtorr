import { UserDto, DBUserDto } from '../user';

export namespace AuthSignUp {
	export const topic = 'auth.signUp.command';

	export class Request extends UserDto {}

	export class Response extends DBUserDto {}
}
