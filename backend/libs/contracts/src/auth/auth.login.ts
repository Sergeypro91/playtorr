import { LoginUserDto, UserSession } from '@app/contracts';

export namespace AuthLogin {
	export const topic = 'auth.login.command';

	export class Request extends LoginUserDto {}

	export class Response extends UserSession {}
}
