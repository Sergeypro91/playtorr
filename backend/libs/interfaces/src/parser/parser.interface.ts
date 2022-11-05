export enum SearchStatus {
	CREATED = 'created',
	UPDATING = 'updating',
	FINISHED = 'finished',
}

export interface ISearchQuery {
	searchQuery: string;
	lastUpdate: string;
	searchStatus: SearchStatus;
	torrentFiles: ITorrentFile[];
}

export interface ITorrentFile {
	torrentLabel: string;
	name: string;
	size?: string;
	magnet?: string;
	seeders?: string;
	leechers?: string;
}

export interface IPictureTorrents {
	imdbId: string;
	searchRequests: ISearchQuery[];
}
