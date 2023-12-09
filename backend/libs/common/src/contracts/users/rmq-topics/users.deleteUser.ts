import { IsString } from 'class-validator';

export namespace UsersDeleteUser {
	export const topic = 'users.deleteUser.command';

	export class Request {
		@IsString()
		id: string;
	}
}
