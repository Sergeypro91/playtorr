import { SigninLocalDto, TokensDto } from '../dtos';

export namespace AuthSigninLocal {
	export const topic = 'auth.signinLocal.command';

	export class Request extends SigninLocalDto {}

	export class Response extends TokensDto {}
}
