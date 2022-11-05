import { IPictureTorrents, ISearchQuery, SearchStatus } from '@app/interfaces';

export class PictureTorrentsEntity implements IPictureTorrents {
	imdbId: string;
	searchRequests: ISearchQuery[];

	constructor(pictureTorrents) {
		this.imdbId = pictureTorrents.imdbId;
		this.searchRequests = pictureTorrents.searchRequests;
	}

	// public setSearchStatus(
	// 	imdbId: string,
	// 	searchQuery: string,
	// 	searchStatus: SearchStatus,
	// ) {}
}
