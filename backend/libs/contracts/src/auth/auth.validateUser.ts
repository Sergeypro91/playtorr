import { LoginUserDto } from '@app/contracts';
import { User } from 'apps/user/src/models';

export namespace AuthValidateUser {
	export const topic = 'auth.validateUser.command';

	export class Request extends LoginUserDto {}

	export class Response extends User {}
}
