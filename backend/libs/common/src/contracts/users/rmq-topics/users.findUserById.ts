import { IsString } from 'class-validator';
import { WrappedUserDto } from '../dtos';

export namespace UsersFindUserById {
	export const topic = 'users.findUserById.command';

	export class Request {
		@IsString()
		id: string;
	}

	export class Response extends WrappedUserDto {}
}
