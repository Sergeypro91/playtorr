import { DBUserDto } from './user.dto';
import { UserEmailDto } from '../auth';

export namespace UserGetUser {
	export const topic = 'user.getUser.command';

	export class Request extends UserEmailDto {}

	export class Response extends DBUserDto {}
}
