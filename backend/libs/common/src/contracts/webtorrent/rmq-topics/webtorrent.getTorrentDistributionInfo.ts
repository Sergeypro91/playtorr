import {
	GetTorrentDistributionInfoRequestDto,
	GetTorrentDistributionInfoResponseDto,
} from '../dtos';

export namespace GetTorrentDistributionInfo {
	export const topic = 'webtorrent.getTorrentInfo.command';

	export class Request extends GetTorrentDistributionInfoRequestDto {}

	export class Response extends GetTorrentDistributionInfoResponseDto {}
}
