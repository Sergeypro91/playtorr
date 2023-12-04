import { GetTorrentsRequestDto, GetTorrentsResponseDto } from '../dtos';

export namespace ParserGetPictureTorrents {
	export const topic = 'parser.getPictureTorrents.command';

	export class Request extends GetTorrentsRequestDto {}

	export class Response extends GetTorrentsResponseDto {}
}
