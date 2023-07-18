import { GetTmdbPersonRequestDto, GetTmdbPersonResponseDto } from '../dtos';

export namespace GetTmdbPerson {
	export const topic = 'tmdb.getTmdbPerson.command';

	export class Request extends GetTmdbPersonRequestDto {}

	export class Response extends GetTmdbPersonResponseDto {}
}
