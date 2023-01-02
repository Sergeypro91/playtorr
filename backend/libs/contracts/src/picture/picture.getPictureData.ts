import { GetPictureDataDto, PictureDetailDataDto } from '@app/contracts';

export namespace PictureGetPictureData {
	export const topic = 'picture.getPictureData.command';

	export class Request extends GetPictureDataDto {}

	export class Response extends PictureDetailDataDto {}
}
