import { GetPicture, PictureDto } from '../dtos';

export namespace PictureGetPicture {
	export const topic = 'picture.getPicture.command';

	export class Request extends GetPicture {}

	export class Response extends PictureDto {}
}
