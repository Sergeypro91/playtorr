import { GetPictureDto, PictureDto } from './dtos';

export namespace PictureGetPicture {
	export const topic = 'picture.getPicture.command';

	export class Request extends GetPictureDto {}

	export class Response extends PictureDto {}
}
