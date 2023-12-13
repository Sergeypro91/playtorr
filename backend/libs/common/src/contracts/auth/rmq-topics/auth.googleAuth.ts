import { GoogleUserDto, TokensDto } from '../dtos';

export namespace AuthGoogleAuth {
	export const topic = 'auth.googleAuth.command';

	export class Request extends GoogleUserDto {}

	export class Response extends TokensDto {}
}
