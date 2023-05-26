import { IWebTorrent, IWebTorrentInfo } from '@app/common';
import { MediaType } from '@app/common/types';

export class WebTorrentEntity implements IWebTorrent {
	tmdbId: string;
	imdbId: string;
	mediaType: MediaType;
	torrentUrl: string;
	torrentInfo?: IWebTorrentInfo;

	constructor(webTorrent) {
		this.tmdbId = webTorrent.tmdbId;
		this.imdbId = webTorrent.imdbId;
		this.mediaType = webTorrent.mediaType;
		this.torrentUrl = webTorrent.torrentUrl;
		this.torrentInfo = webTorrent.torrentInfo;
	}
}
