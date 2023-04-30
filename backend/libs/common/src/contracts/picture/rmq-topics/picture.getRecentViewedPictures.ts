import { GetRecentViewedPictures, PictureDto } from '../dtos';

export namespace PictureGetRecentViewedPictures {
	export const topic = 'picture.getRecentViewedPictures.command';

	export class Request extends GetRecentViewedPictures {}

	export class Response extends PictureDto {}
}
