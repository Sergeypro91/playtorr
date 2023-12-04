import {
	ParsePictureTorrentsRequestDto,
	ParsePictureTorrentsResponseDto,
} from '../dtos';

export namespace ParserParsePictureTorrents {
	export const topic = 'parser.parsePictureTorrents.command';

	export class Request extends ParsePictureTorrentsRequestDto {}

	export class Response extends ParsePictureTorrentsResponseDto {}
}
