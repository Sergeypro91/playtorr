import {
	GetRecentViewedPicturesRequestDto,
	GetPictureResponseDto,
} from '../dtos';

export namespace PictureGetRecentViewedPictures {
	export const topic = 'picture.getRecentViewedPictures.command';

	export class Request extends GetRecentViewedPicturesRequestDto {}

	export class Response extends GetPictureResponseDto {}
}
