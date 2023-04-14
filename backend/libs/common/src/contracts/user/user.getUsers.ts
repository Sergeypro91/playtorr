import { DBUserDto, UsersEmailDto } from './user.dto';

export namespace UserGetUsers {
	export const topic = 'user.getUsers.command';

	export class Request extends UsersEmailDto {}

	export class Response extends DBUserDto {}
}
