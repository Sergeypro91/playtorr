import { IPicture } from '@app/common/interfaces';
import { MediaType } from '@app/common/types';
import {
	MovieDto,
	TvDto,
} from '@app/common/contracts/picture/dtos/getPictureParams';

export class PictureEntity implements IPicture {
	tmdbId: string;
	imdbId: string;
	mediaType: MediaType;
	pictureData: MovieDto | TvDto;

	constructor(picture) {
		this.imdbId = picture.imdbId;
		this.tmdbId = picture.tmdbId;
		this.mediaType = picture.mediaType;
		this.pictureData = picture.pictureData;
	}
}
