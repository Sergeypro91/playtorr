import { GetTorrentsDto, TorrentInfoDto } from '../dtos';

export namespace ParserParseTorrents {
	export const topic = 'parser.parseTorrents.command';

	export class Request extends GetTorrentsDto {}

	export class Response extends TorrentInfoDto {}
}
