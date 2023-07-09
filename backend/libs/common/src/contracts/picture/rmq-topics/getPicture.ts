import { GetPictureRequestDto, GetPictureResponseDto } from '../dtos';

export namespace GetPicture {
	export const topic = 'picture.getPicture.command';

	export class Request extends GetPictureRequestDto {}

	export class Response extends GetPictureResponseDto {}
}
