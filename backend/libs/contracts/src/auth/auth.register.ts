import { UserDto, DBUserDto } from '@app/contracts';

export namespace AuthRegister {
	export const topic = 'auth.register.command';

	export class Request extends UserDto {}

	export class Response extends DBUserDto {}
}
