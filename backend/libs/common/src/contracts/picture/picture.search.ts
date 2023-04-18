import { SearchRequestDto, SearchResultDto } from './picture.dto';

export namespace PictureSearch {
	export const topic = 'picture.searchPicture.command';

	export class Request extends SearchRequestDto {}

	export class Response extends SearchResultDto {}
}
