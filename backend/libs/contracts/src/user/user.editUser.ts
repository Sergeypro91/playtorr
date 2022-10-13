import { DBUserDto, EditUserDto, UserSessionDto } from '@app/contracts';

export namespace UserEditUser {
	export const topic = 'user.editUser.command';

	export class Request {
		user: EditUserDto;
		userSession: UserSessionDto;
	}

	export class Response extends DBUserDto {}
}
