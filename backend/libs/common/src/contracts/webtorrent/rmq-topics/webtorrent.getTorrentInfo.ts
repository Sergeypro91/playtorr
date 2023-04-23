import { GetTorrentInfo, TorrentInfo } from '../dtos';

export namespace WebtorrentGetTorrentInfo {
	export const topic = 'webtorrent.getTorrentInfo.command';

	export class Request extends GetTorrentInfo {}

	export class Response extends TorrentInfo {}
}
