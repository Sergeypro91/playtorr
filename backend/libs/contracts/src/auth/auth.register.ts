import { CreateUserDto, DBUserDto } from '@app/contracts/createUserDto';

export namespace AuthRegister {
	export const topic = 'auth.register.command';

	export class Request extends CreateUserDto {}

	export class Response extends DBUserDto {}
}
