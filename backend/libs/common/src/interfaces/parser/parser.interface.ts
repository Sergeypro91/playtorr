import { MediaType, EnumStatus } from '@app/common/types';

export interface ISearchQueryData {
	searchQuery: string;
	searchStatus: EnumStatus;
	trackers: ITracker[];
}

export interface ITracker {
	trackerLabel: string;
	torrents: ITorrent[];
	trackerStatus: EnumStatus;
	lastUpdate: string;
	trackerMessage?: string;
}

export interface ITorrent {
	name: string;
	size?: string;
	link?: string;
	seeders?: string;
	leeches?: string;
}

export interface IPictureTorrents {
	imdbId: string;
	tmdbId: string;
	mediaType: MediaType;
	searchRequests: ISearchQueryData[];
}
