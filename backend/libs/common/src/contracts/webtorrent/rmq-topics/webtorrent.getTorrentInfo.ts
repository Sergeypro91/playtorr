import { GetTorrentDistributionInfoDto, WebTorrentDto } from '../dtos';

export namespace WebtorrentGetTorrentInfo {
	export const topic = 'webtorrent.getTorrentInfo.command';

	export class Request extends GetTorrentDistributionInfoDto {}

	export class Response extends WebTorrentDto {}
}
