import { IsEmail, IsString } from 'class-validator';

export namespace AuthJWTLogin {
	export const topic = 'auth.jwtLogin.command';

	export class Request {
		@IsEmail()
		email: string;

		@IsString()
		password: string;
	}

	export class Response {
		access_token: string;
	}
}
