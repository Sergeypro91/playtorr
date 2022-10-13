import { DBUserDto, LoginUserDto } from '@app/contracts/createUser.dto';

export namespace AuthValidateUser {
	export const topic = 'auth.validateUser.command';

	export class Request extends LoginUserDto {}

	export class Response extends DBUserDto {}
}
