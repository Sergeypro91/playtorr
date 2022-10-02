import { DBUserDto, LoginUserDto } from '@app/contracts/createUserDto';

export namespace AuthValidateUser {
	export const topic = 'auth.validateUser.command';

	export class Request extends LoginUserDto {}

	export class Response extends DBUserDto {}
}
