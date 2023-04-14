import { DBUserDto } from '../user';
import { LoginUserDto } from './auth.dto';

export namespace AuthValidateUser {
	export const topic = 'auth.validateUser.command';

	export class Request extends LoginUserDto {}

	export class Response extends DBUserDto {}
}
