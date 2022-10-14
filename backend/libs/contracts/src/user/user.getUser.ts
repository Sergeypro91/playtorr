import { DBUserDto } from '@app/contracts/createUser.dto';
import { IsEmail } from 'class-validator';

export namespace UserGetUser {
	export const topic = 'user.getUser.command';

	export class Request {
		@IsEmail()
		email: string;
	}

	export class Response extends DBUserDto {}
}
