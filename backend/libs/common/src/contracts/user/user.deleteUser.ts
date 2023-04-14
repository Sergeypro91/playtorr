import { DBUserDto } from './user.dto';
import { UserEmailDto } from '../auth';

export namespace UserDeleteUser {
	export const topic = 'user.deleteUser.command';

	export class Request extends UserEmailDto {}

	export class Response extends DBUserDto {}
}
