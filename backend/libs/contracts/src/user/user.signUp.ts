import { UserDto, DBUserDto } from '@app/contracts';

export namespace UserSignUp {
	export const topic = 'user.signUp.command';

	export class Request extends UserDto {}

	export class Response extends DBUserDto {}
}
