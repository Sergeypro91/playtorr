import { UserEmailDto, DBUserDto } from '@app/contracts';

export namespace UserGetUser {
	export const topic = 'user.getUser.command';

	export class Request extends UserEmailDto {}

	export class Response extends DBUserDto {}
}
