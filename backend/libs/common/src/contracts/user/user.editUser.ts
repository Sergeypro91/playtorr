import { DBUserDto, EditUserSessionDto } from './user.dto';

export namespace UserEditUser {
	export const topic = 'user.editUser.command';

	export class Request extends EditUserSessionDto {}

	export class Response extends DBUserDto {}
}
