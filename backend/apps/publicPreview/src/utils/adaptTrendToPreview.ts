import {
	IMovieSlim,
	IPersonSlim,
	ISectionTile,
	ITvSlim,
} from '@app/common/interfaces';
import { MediaType } from '@app/common';

type AdaptTrendToPreviewArgs = {
	picture: IMovieSlim | ITvSlim | IPersonSlim;
	posterBaseUrl: string;
};

const getTitle = (picture: AdaptTrendToPreviewArgs['picture']) => {
	if (picture.mediaType !== MediaType.PERSON) {
		if (picture.hPosterPath) {
			return undefined;
		}

		if (picture.backdropPath) {
			return picture.title;
		}

		return undefined;
	}

	return picture.name;
};

const defineRatio = (picture: AdaptTrendToPreviewArgs['picture']) => {
	if (picture.mediaType !== MediaType.PERSON) {
		if (picture.hPosterPath || picture.backdropPath) {
			return '16by9';
		}

		return '2by3';
	}

	return '4by3';
};

export const getTrendImage = (picture: AdaptTrendToPreviewArgs['picture']) => {
	if (picture.mediaType !== MediaType.PERSON) {
		if (picture.hPosterPath || picture.backdropPath) {
			return picture.hPosterPath || picture.backdropPath;
		}

		return picture.posterPath;
	}

	return picture.profilePath;
};

export const adaptTrendToPreview = ({
	picture,
	posterBaseUrl,
}: AdaptTrendToPreviewArgs): ISectionTile => {
	return {
		title: getTitle(picture),
		image_ratio: defineRatio(picture),
		image_url: `${posterBaseUrl}${getTrendImage(picture)}`,
		action_data: `{\"videoIdx\": ${picture['tmdbId']}}`,
		is_playable: false,
	};
};
