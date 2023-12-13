import { AuthRefreshTokenDto, TokensDto } from '../dtos';

export namespace AuthRefreshToken {
	export const topic = 'auth.refreshToken.command';

	export class Request extends AuthRefreshTokenDto {}

	export class Response extends TokensDto {}
}
