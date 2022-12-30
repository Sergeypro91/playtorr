import { IPictureTorrents, ISearchQueryData } from '@app/interfaces';

export class PictureTorrentsEntity implements IPictureTorrents {
	imdbId: string;
	searchRequests: ISearchQueryData[];

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
