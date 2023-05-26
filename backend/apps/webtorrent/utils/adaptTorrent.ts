import { WebTorrentInfoDto } from '@app/common';
import { Torrent } from 'webtorrent';

export const adaptTorrent = (torrent: Torrent): WebTorrentInfoDto => {
	return {
		name: torrent.name,
		length: torrent.length,
		created: new Date(torrent?.created ?? Date.now()).toISOString(),
		files: [],
	};
};
