import { LoginUserDto, DBUserDto } from '@app/contracts';

export namespace AuthValidateUser {
	export const topic = 'auth.validateUser.command';

	export class Request extends LoginUserDto {}

	export class Response extends DBUserDto {}
}
