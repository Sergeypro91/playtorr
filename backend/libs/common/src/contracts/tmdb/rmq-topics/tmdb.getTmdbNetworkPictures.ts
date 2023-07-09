import {
	GetTmdbNetworkPicturesRequestDto,
	GetTmdbNetworkPicturesResponseDto,
} from '../dtos';

export namespace TmdbGetTmdbNetworkPictures {
	export const topic = 'tmdb.getTmdbNetworkPictures.command';

	export class Request extends GetTmdbNetworkPicturesRequestDto {}

	export class Response extends GetTmdbNetworkPicturesResponseDto {}
}
