import { DBUserDto, EditUserDto, UserSession } from '@app/contracts';

export namespace UserEditUser {
	export const topic = 'user.editUser.command';

	export class Request {
		user: EditUserDto;
		userSession: UserSession;
	}

	export class Response extends DBUserDto {}
}
