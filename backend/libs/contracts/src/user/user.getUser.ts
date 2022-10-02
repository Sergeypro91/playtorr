import { DBUserDto, UserSession } from '@app/contracts/createUserDto';

export namespace UserGetUser {
	export const topic = 'user.getUser.command';

	export class Request extends UserSession {}

	export class Response extends DBUserDto {}
}
