import { ActivationDto, TokensDto } from '../dtos';

export namespace AuthSignupConfirmation {
	export const topic = 'auth.signupConfirmation.command';

	export class Request extends ActivationDto {}

	export class Response extends TokensDto {}
}
