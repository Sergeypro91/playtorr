import { NewUserDto, UserWithoutPasswordDto } from '../dtos';

export namespace UsersCreateUser {
	export const topic = 'users.createUser.command';

	export class Request extends NewUserDto {}

	export class Response extends UserWithoutPasswordDto {}
}
