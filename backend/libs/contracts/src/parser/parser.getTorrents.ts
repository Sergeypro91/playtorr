import { GetTorrentsDto, TorrentFileDto } from '@app/contracts';

export namespace ParserGetTorrents {
	export const topic = 'parser.getTorrents.command';

	export class Request extends GetTorrentsDto {}

	export class Response extends TorrentFileDto {}
}
