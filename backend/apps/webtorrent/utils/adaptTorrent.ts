import { TorrentDistributionInfoDto } from '@app/common';
import { Torrent } from 'webtorrent';

export const adaptTorrent = (torrent: Torrent): TorrentDistributionInfoDto => {
	return {
		name: torrent.name,
		length: torrent.length,
		created: torrent.created,
		files: [],
	};
};
