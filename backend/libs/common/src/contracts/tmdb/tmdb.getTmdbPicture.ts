import { GetTmdbPictureDto, TmdbMovieDto, TmdbTvDto } from './dtos';

export namespace TmdbGetTmdbPicture {
	export const topic = 'tmdb.getPicture.command';

	export class Request extends GetTmdbPictureDto {}

	export class ResponseA extends TmdbMovieDto {}

	export class ResponseB extends TmdbTvDto {}
}
