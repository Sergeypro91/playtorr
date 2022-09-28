import { Role } from '@app/interfaces/user/user.interface';

export namespace AuthLogin {
	export const topic = 'auth.login.command';

	export class Request {
		email: string;
		password: string;
	}

	export class Response {
		email: string;
		tgId: number;
		role: Role;
	}
}
