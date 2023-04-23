import { GetTmdbPicture, TmdbMovieDto, TmdbTvDto } from './dtos';

export namespace TmdbGetTmdbPicture {
	export const topic = 'tmdb.getTmdbPicture.command';

	export class Request extends GetTmdbPicture {}

	export class ResponseMovie extends TmdbMovieDto {}

	export class ResponseTv extends TmdbTvDto {}
}
