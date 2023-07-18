import { GetTmdbSearchRequestDto, GetTmdbSearchResultDto } from '../dtos';

export namespace GetTmdbSearch {
	export const topic = 'tmdb.searchTmdb.command';

	export class Request extends GetTmdbSearchRequestDto {}

	export class Response extends GetTmdbSearchResultDto {}
}
