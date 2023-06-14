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
	tmdbId: tmdbMovieSlim['id'],
	mediaType: tmdbMovieSlim['media_type'],
	posterPath: tmdbMovieSlim['poster_path'],
	hPosterPath: getHPoster(tmdbMovieSlim['images']),
	backdropPath: tmdbMovieSlim['backdrop_path'],
	title: tmdbMovieSlim['title'],
	originalTitle: tmdbMovieSlim['original_title'],
	overview: tmdbMovieSlim['overview'],
	genres: tmdbMovieSlim['genre_ids'],
	releaseDate: tmdbMovieSlim['release_date'],
	popularity: tmdbMovieSlim['popularity'],
	voteAverage: tmdbMovieSlim['vote_average'],
});

const adaptToSlimTv = (tmdbMovieSlim): ITvSlim => ({
	tmdbId: tmdbMovieSlim['id'],
	mediaType: tmdbMovieSlim['media_type'],
	posterPath: tmdbMovieSlim['poster_path'],
	hPosterPath: getHPoster(tmdbMovieSlim['images']),
	backdropPath: tmdbMovieSlim['backdrop_path'],
	title: tmdbMovieSlim['name'],
	originalTitle: tmdbMovieSlim['original_name'],
	overview: tmdbMovieSlim['overview'],
	genres: tmdbMovieSlim['genre_ids'],
	popularity: tmdbMovieSlim['popularity'],
	voteAverage: tmdbMovieSlim['vote_average'],
	releaseDate: tmdbMovieSlim['first_air_date'],
});

const adaptToSlimPerson = (tmdbMovieSlim): IPersonSlim => ({
	tmdbId: tmdbMovieSlim['id'],
	mediaType: tmdbMovieSlim['media_type'],
	name: tmdbMovieSlim['name'],
	profilePath: tmdbMovieSlim['profile_path'],
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
