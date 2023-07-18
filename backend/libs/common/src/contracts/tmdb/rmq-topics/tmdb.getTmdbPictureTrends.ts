import {
	GetTmdbPictureTrendsRequestDto,
	GetTmdbPictureTrendsResponseDto,
} from '../dtos';

export namespace GetTmdbPictureTrends {
	export const topic = 'tmdb.getTmdbPictureTrends.command';

	export class Request extends GetTmdbPictureTrendsRequestDto {}

	export class Response extends GetTmdbPictureTrendsResponseDto {}
}
