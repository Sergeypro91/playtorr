import { GetTorrentsDto, TrackerDto } from '../dtos';

export namespace ParserGetPictureTorrents {
	export const topic = 'parser.getPictureTorrents.command';

	export class Request extends GetTorrentsDto {}

	export class Response extends TrackerDto {}
}
