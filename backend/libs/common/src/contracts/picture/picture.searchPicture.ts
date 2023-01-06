import { SearchPictureDto, PicturePageDto } from './picture.dto';

export namespace PictureSearchPicture {
	export const topic = 'picture.searchPicture.command';

	export class Request extends SearchPictureDto {}

	export class Response extends PicturePageDto {}
}
