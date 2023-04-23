import { IMovieSlim, IPersonSlim, ITvSlim } from '@app/common';
import { MediaType } from '@app/common/types';

const adaptToSlimMovie = (tmdbMovieSlim): IMovieSlim => ({
	posterPath: tmdbMovieSlim['poster_path'],
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
