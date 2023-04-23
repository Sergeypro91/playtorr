import { IPicture } from '@app/common/interfaces';

export const adaptPictureTrends = (pictureData: unknown): IPicture => {
	return {
		tmdbId: pictureData['id'],
		imdbId: pictureData?.['imdb_id'] || null,
		mediaType: pictureData['media_type'],
		pictureData: pictureData['pictureData'],
	};
};
