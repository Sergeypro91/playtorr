import { GetPictureDataDto, PictureDataDto } from '@app/contracts';

export namespace PictureGetPictureData {
	export const topic = 'picture.getPictureData.command';

	export class Request extends GetPictureDataDto {}

	export class Response extends PictureDataDto {}
}
