import { UserWithoutPasswordDto } from '../../users/dtos';
import { SignupLocalDto } from '../dtos';

export namespace AuthSignupLocal {
	export const topic = 'auth.signupLocal.command';

	export class Request extends SignupLocalDto {}

	export class Response extends UserWithoutPasswordDto {}
}
