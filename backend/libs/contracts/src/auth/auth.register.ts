import { CreateUserDto, DBUserDto } from '@app/contracts/createUser.dto';

export namespace AuthRegister {
	export const topic = 'auth.register.command';

	export class Request extends CreateUserDto {}

	export class Response extends DBUserDto {}
}
