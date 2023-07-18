import {
	GetTmdbPictureRequestDto,
	GetTmdbMovieResponseDto,
	GetTmdbTvResponseDto,
} from '../dtos';

export namespace GetTmdbPicture {
	export const topic = 'tmdb.getTmdbPicture.command';

	export class Request extends GetTmdbPictureRequestDto {}

	export class ResponseMovie extends GetTmdbMovieResponseDto {}

	export class ResponseTv extends GetTmdbTvResponseDto {}
}
