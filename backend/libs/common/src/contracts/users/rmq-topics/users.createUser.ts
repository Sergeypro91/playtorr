import { NewUserDto, UserDto } from '../dtos';

export namespace UsersCreateUser {
	export const topic = 'users.createUser.command';

	export class Request extends NewUserDto {}

	export class Response extends UserDto {}
}
