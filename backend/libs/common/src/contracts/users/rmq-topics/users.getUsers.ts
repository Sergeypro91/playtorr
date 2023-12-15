import { UsersEmailDto, WrappedUsersDto } from '../dtos';

export namespace UsersGetUsers {
	export const topic = 'users.getUsers.command';

	export class Request extends UsersEmailDto {}

	export class Response extends WrappedUsersDto {}
}