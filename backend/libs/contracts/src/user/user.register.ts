import { UserDto, DBUserDto } from '@app/contracts';

export namespace UserRegister {
	export const topic = 'user.register.command';

	export class Request extends UserDto {}

	export class Response extends DBUserDto {}
}
