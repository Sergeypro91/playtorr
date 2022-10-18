import { DBUserDto, UsersEmailDto } from '@app/contracts';

export namespace UserGetUsers {
	export const topic = 'user.getUsers.command';

	export class Request extends UsersEmailDto {}

	export class Response extends DBUserDto {}
}
