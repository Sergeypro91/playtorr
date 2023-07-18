import {
	IImages,
	IMovieSlim,
	IPersonSlim,
	IResultsVideoObj,
	ITvSlim,
} from '@app/common/interfaces';
import { MediaType } from '@app/common/types';
import { ConfigService } from '@nestjs/config';

const getHPoster = (images?: IImages) => {
	if (images) {
		const hPosters = images.backdrops
			.filter((backdrop) =>
				['en', 'uk', 'us', 'ru'].includes(backdrop['iso_639_1']),
			)
			.sort((a, b) => {
				if (a['width'] === b['width']) {
					return b['vote_average'] - a['vote_average'];
				} else {
					return b['width'] - a['width'];
				}
			});

		return hPosters[0]?.['file_path'] || null;
	}

	return null;
};

const getBackdrop = (images?: IImages) => {
	if (images) {
		const hPosters = images.backdrops
			.filter((backdrop) => !backdrop['iso_639_1'])
			.sort((a, b) => {
				if (a['width'] === b['width']) {
					return b['vote_count'] - a['vote_count'];
				} else {
					return b['width'] - a['width'];
				}
			});

		return hPosters[0]?.['file_path'] || null;
	}

	return null;
};

const getTrailer = ({
	videos,
	config,
}: {
	videos: IResultsVideoObj;
	config?: ConfigService;
}) => {
	if (videos && config) {
		const youtubeVideoUrl = config.get('YOUTUBE_VIDEO_URL', '');
		const sortedVideos = videos.results.sort((a, b) => {
			if (a.type === 'Teaser' && b.type === 'Trailer') {
				return 1;
			}

			if (
				(['Trailer', 'Teaser'].includes(a.type) ||
					(a.size > b.size && a.official)) &&
				a['iso_639_1'] === 'en'
			) {
				return -1;
			}

			return 0;
		});

		switch (sortedVideos[0]?.site) {
			case 'YouTube':
				return `${youtubeVideoUrl}${sortedVideos[0].key}`;
			default:
				return null;
		}
	}

	return null;
};

const adaptToSlimMovie = ({
	searchResult: tmdbMovieSlim,
	config,
}: AdaptOptions): IMovieSlim => ({
	tmdbId: tmdbMovieSlim['id'],
	mediaType: tmdbMovieSlim['media_type'],
	posterPath: tmdbMovieSlim['poster_path'],
	hPosterPath: getHPoster(tmdbMovieSlim['images']),
	backdropPath:
		getBackdrop(tmdbMovieSlim['images']) ?? tmdbMovieSlim['backdrop_path'],
	title: tmdbMovieSlim['title'],
	originalTitle: tmdbMovieSlim['original_title'],
	overview: tmdbMovieSlim['overview'],
	genres: tmdbMovieSlim['genre_ids'],
	releaseDate: tmdbMovieSlim['release_date'],
	popularity: tmdbMovieSlim['popularity'],
	voteAverage: tmdbMovieSlim['vote_average'],
	trailer: getTrailer({ videos: tmdbMovieSlim['videos'], config }),
});

const adaptToSlimTv = ({
	searchResult: tmdbTvSlim,
	config,
}: AdaptOptions): ITvSlim => ({
	tmdbId: tmdbTvSlim['id'],
	mediaType: tmdbTvSlim['media_type'],
	posterPath: tmdbTvSlim['poster_path'],
	hPosterPath: getHPoster(tmdbTvSlim['images']),
	backdropPath:
		getBackdrop(tmdbTvSlim['images']) || tmdbTvSlim['backdrop_path'],
	title: tmdbTvSlim['name'],
	originalTitle: tmdbTvSlim['original_name'],
	overview: tmdbTvSlim['overview'],
	genres: tmdbTvSlim['genre_ids'],
	popularity: tmdbTvSlim['popularity'],
	voteAverage: tmdbTvSlim['vote_average'],
	releaseDate: tmdbTvSlim['first_air_date'],
	trailer: getTrailer({ videos: tmdbTvSlim['videos'], config }),
});

const adaptToSlimPerson = ({
	searchResult: tmdbPersonSlim,
}: AdaptOptions): IPersonSlim => ({
	tmdbId: tmdbPersonSlim['id'],
	mediaType: tmdbPersonSlim['media_type'],
	name: tmdbPersonSlim['name'],
	profilePath: tmdbPersonSlim['profile_path'],
	popularity: tmdbPersonSlim['popularity'],
});

type AdaptOptions = {
	searchResult: unknown;
	config?: ConfigService;
};

export const adaptSlimResult = (
	options: AdaptOptions,
): IMovieSlim | ITvSlim | IPersonSlim => {
	switch (options.searchResult['media_type']) {
		case MediaType.MOVIE:
			return adaptToSlimMovie(options);
		case MediaType.TV:
			return adaptToSlimTv(options);
		case MediaType.PERSON:
			return adaptToSlimPerson(options);
	}
};
