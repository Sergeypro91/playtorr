import { SigninLocalDto } from '../dtos';
import { UserWithoutPasswordDto } from '../../users/dtos';

export namespace AuthSigninLocal {
	export const topic = 'auth.signinLocal.command';

	export class Request extends SigninLocalDto {}

	export class Response extends UserWithoutPasswordDto {}
}
