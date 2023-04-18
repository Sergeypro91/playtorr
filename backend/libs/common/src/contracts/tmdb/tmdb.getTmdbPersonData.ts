import { GetTmdbPersonDataDto, TmdbPersonDataDto } from './tmdb.dto';

export namespace TmdbGetTmdbPersonData {
	export const topic = 'tmdb.getPersonData.command';

	export class Request extends GetTmdbPersonDataDto {}

	export class Response extends TmdbPersonDataDto {}
}
