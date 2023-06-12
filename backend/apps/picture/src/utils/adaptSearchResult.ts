import {
	IImages,
	IMovieSlim,
	IPersonSlim,
	ITvSlim,
} from '@app/common/interfaces';
import { MediaType } from '@app/common/types';

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

const adaptToSlimMovie = (tmdbMovieSlim): IMovieSlim => ({
	posterPath: tmdbMovieSlim['poster_path'],
	hPosterPath: getHPoster(tmdbMovieSlim['images']),
	backdropPath: tmdbMovieSlim['backdrop_path'],
	releaseDate: tmdbMovieSlim['release_date'],
	originalTitle: tmdbMovieSlim['original_title'],
	genres: tmdbMovieSlim['genre_ids'],
	tmdbId: tmdbMovieSlim['id'],
	mediaType: tmdbMovieSlim['media_type'],
	title: tmdbMovieSlim['title'],
	popularity: tmdbMovieSlim['popularity'],
	voteAverage: tmdbMovieSlim['vote_average'],
});

const adaptToSlimTv = (tmdbMovieSlim): ITvSlim => ({
	posterPath: tmdbMovieSlim['poster_path'],
	hPosterPath: getHPoster(tmdbMovieSlim['images']),
	backdropPath: tmdbMovieSlim['backdrop_path'],
	popularity: tmdbMovieSlim['popularity'],
	tmdbId: tmdbMovieSlim['id'],
	overview: tmdbMovieSlim['overview'],
	voteAverage: tmdbMovieSlim['vote_average'],
	mediaType: tmdbMovieSlim['media_type'],
	releaseDate: tmdbMovieSlim['first_air_date'],
	genres: tmdbMovieSlim['genre_ids'],
	title: tmdbMovieSlim['name'],
	originalTitle: tmdbMovieSlim['original_name'],
});

const adaptToSlimPerson = (tmdbMovieSlim): IPersonSlim => ({
	profilePath: tmdbMovieSlim['profile_path'],
	tmdbId: tmdbMovieSlim['id'],
	mediaType: tmdbMovieSlim['media_type'],
	name: tmdbMovieSlim['name'],
	popularity: tmdbMovieSlim['popularity'],
});

export const adaptSearchResult = (
	searchResult: unknown,
): IMovieSlim | ITvSlim | IPersonSlim => {
	switch (searchResult['media_type']) {
		case MediaType.MOVIE:
			return adaptToSlimMovie(searchResult);
		case MediaType.TV:
			return adaptToSlimTv(searchResult);
		case MediaType.PERSON:
			return adaptToSlimPerson(searchResult);
	}
};

export const adaptPictureTrendsResult = (
	searchResult: unknown,
): IMovieSlim | ITvSlim => {
	switch (searchResult['media_type']) {
		case MediaType.MOVIE:
			return adaptToSlimMovie(searchResult);
		case MediaType.TV:
			return adaptToSlimTv(searchResult);
	}
};
