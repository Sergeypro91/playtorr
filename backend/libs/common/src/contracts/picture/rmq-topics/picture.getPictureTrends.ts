import { SearchResultDto, GetPictureTrendsDto } from '../dtos';

export namespace GetPictureTrends {
	export const topic = 'picture.getPictureTrends.command';

	export class Request extends GetPictureTrendsDto {}

	export class Response extends SearchResultDto {}
}
