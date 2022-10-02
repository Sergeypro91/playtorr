import { DBUserDto, UsersEmailDto } from '@app/contracts';

export namespace UserDeleteUsers {
	export const topic = 'user.deleteUsers.command';

	export class Request extends UsersEmailDto {}

	export class Response extends DBUserDto {}
}
