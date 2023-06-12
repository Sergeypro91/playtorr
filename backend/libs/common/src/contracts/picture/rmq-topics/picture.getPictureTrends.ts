import {
	GetPictureTrendsRequestDto,
	GetPictureTrendsResponseDto,
} from '../dtos';

export namespace GetPictureTrends {
	export const topic = 'picture.getPictureTrends.command';

	export class Request extends GetPictureTrendsRequestDto {}

	export class Response extends GetPictureTrendsResponseDto {}
}
