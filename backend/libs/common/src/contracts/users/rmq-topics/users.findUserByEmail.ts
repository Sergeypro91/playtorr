import { IsEmail, IsString } from 'class-validator';
import { UserWithoutPasswordDto } from '../dtos';

export namespace UsersFindUserByEmail {
	export const topic = 'users.findUserByEmail.command';

	export class Request {
		@IsEmail()
		@IsString()
		email: string;
	}

	export class Response extends UserWithoutPasswordDto {}
}
