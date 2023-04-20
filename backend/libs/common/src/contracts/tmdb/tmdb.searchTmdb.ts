import { SearchRequestTmdbDto, SearchResultTmdbDto } from './dtos';

export namespace TmdbSearchTmdb {
	export const topic = 'tmdb.searchTmdb.command';

	export class Request extends SearchRequestTmdbDto {}

	export class Response extends SearchResultTmdbDto {}
}
