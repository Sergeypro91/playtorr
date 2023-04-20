import { IPictureTorrents, ISearchQueryData } from '@app/common';
import { MediaType } from '@app/common/types';

export class PictureTorrentsEntity implements IPictureTorrents {
	imdbId: string;
	tmdbId: string;
	mediaType: MediaType;
	searchRequests: ISearchQueryData[];

	constructor(pictureTorrents) {
		this.imdbId = pictureTorrents.imdbId;
		this.tmdbId = pictureTorrents.tmdbId;
		this.mediaType = pictureTorrents.mediaType;
		this.searchRequests = pictureTorrents.searchRequests;
	}
}
