import { IsEmail, IsString } from 'class-validator';
import { UserDto } from '../dtos';

export namespace UsersGetUserUnsafe {
	export const topic = 'users.getUserUnsafe.command';

	export class Request {
		@IsEmail()
		@IsString()
		email: string;
	}

	export class Response extends UserDto {}
}
