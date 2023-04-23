import { GetTmdbPictureTrendsDto, TmdbPictureTrendsDto } from './dtos';

export namespace TmdbGetTmdbPictureTrends {
	export const topic = 'tmdb.getTmdbPictureTrends.command';

	export class Request extends GetTmdbPictureTrendsDto {}

	export class Response extends TmdbPictureTrendsDto {}
}
