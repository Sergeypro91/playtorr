import { UserDto, DBUserDto } from './user.dto';

export namespace UserSignUp {
	export const topic = 'user.signUp.command';

	export class Request extends UserDto {}

	export class Response extends DBUserDto {}
}
