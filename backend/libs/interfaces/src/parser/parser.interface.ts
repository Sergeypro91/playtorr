export enum EnumStatus {
	CREATED = 'created',
	UPDATING = 'updating',
	FINISHED = 'finished',
	WARNING = 'warning',
	ERROR = 'error',
}

export interface ISearchQueryData {
	searchQuery: string;
	lastUpdate: string;
	searchStatus: EnumStatus;
	torrents: ITorrent[];
}

export interface ITorrent {
	torrentLabel: string;
	torrentFiles: ITorrentFile[];
	torrentStatus: EnumStatus;
	torrentStatusMessage?: string;
}

export interface ITorrentFile {
	name: string;
	size?: string;
	magnet?: string;
	seeders?: string;
	leeches?: string;
}

export interface IPictureTorrents {
	imdbId: string;
	searchRequests: ISearchQueryData[];
}
