import { GetTmdbPersonDto, TmdbPersonDto } from './dtos';

export namespace TmdbGetTmdbPerson {
	export const topic = 'tmdb.getPerson.command';

	export class Request extends GetTmdbPersonDto {}

	export class Response extends TmdbPersonDto {}
}
