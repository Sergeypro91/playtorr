import { EditableUserDto, UserWithoutPasswordDto } from '../dtos';

export namespace UsersEditUser {
	export const topic = 'users.editUser.command';

	export class Request extends EditableUserDto {}

	export class Response extends UserWithoutPasswordDto {}
}
