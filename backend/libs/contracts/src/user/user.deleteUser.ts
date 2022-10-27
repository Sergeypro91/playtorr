import { DBUserDto, UserEmailDto } from '@app/contracts';

export namespace UserDeleteUser {
	export const topic = 'user.deleteUser.command';

	export class Request extends UserEmailDto {}

	export class Response extends DBUserDto {}
}
