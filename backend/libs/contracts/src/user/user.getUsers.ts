import { DBUserDto, UsersEmailDto } from '@app/contracts/createUserDto';

export namespace UserGetUsers {
	export const topic = 'user.getUsers.command';

	export class Request extends UsersEmailDto {}

	export class Response extends DBUserDto {}
}
