import { PicturePageDto, GetPictureTrendsDto } from '@app/contracts';

export namespace GetPictureTrends {
	export const topic = 'picture.getPictureTrends.command';

	export class Request extends GetPictureTrendsDto {}

	export class Response extends PicturePageDto {}
}
