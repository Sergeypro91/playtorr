import { Role } from '@app/interfaces/user/user.interface';
import { IsEmail, IsString } from 'class-validator';

export namespace AuthLogin {
	export const topic = 'auth.login.command';

	export class Request {
		@IsEmail()
		email: string;

		@IsString()
		password: string;
	}

	export class Response {
		email: string;
		tgId: number;
		role: Role;
	}
}
