import {
	MediaType,
	ICompany,
	IImage,
	IPeople,
	IPicture,
	IPictureDetail,
	ISeason,
	IVideo,
	IPersonSlim,
	IMovieSlim,
	ITvSlim,
} from '@app/common';

export type ConvertTmdbToLocalPictureArgs = {
	picture: { unknown };
	tmdbId: string;
	imdbId?: string;
	mediaType: MediaType;
};

const convertCompany = (company = []): ICompany[] | undefined => {
	return company
		? company.map((company) => ({
				logoPath: company['logo_path'] || undefined,
				name: company['name'] || undefined,
		  }))
		: undefined;
};

const convertSeason = (seasons = []): ISeason[] | undefined => {
	return seasons
		? seasons.map((season) => ({
				releaseDate: season['air_date'] || undefined,
				episodeCount: season['episodeCount'] || 0,
				name: season['name'] || undefined,
				overview: season['overview'] || undefined,
				posterPath: season['poster_path'] || undefined,
				seasonNumber: season['season_number'] || 0,
		  }))
		: undefined;
};

const convertVideo = (videos = []): IVideo[] => {
	return videos
		? videos.map((video) => ({
				iso: video['iso_639_1'] || undefined,
				name: video['name'] || undefined,
				key: video['key'] || undefined,
				site: video['site'] || undefined,
				size: video['size'] || undefined,
				type: video['type'] || undefined,
				official: video['official'] || undefined,
				publishedAt: video['published_at'] || undefined,
		  }))
		: [];
};

const convertCredit = (credits = []): IPeople[] => {
	return credits.length
		? credits.map((credit) => ({
				peopleId: credit['id'] || undefined,
				position: credit['known_for_department'] || undefined,
				name: credit['name'] || undefined,
				originalName: credit['original_name'] || undefined,
				photo: credit['profile_path'] || undefined,
				character: credit['character'] || undefined,
		  }))
		: [];
};

const convertImage = (images = []): IImage[] => {
	return images
		? images.map((image) => ({
				aspectRatio: image['aspect_ratio'] || undefined,
				height: image['height'] || undefined,
				iso: image['iso_639_1'] || undefined,
				filePath: image['file_path'] || undefined,
				voteAverage: image['vote_average'] || undefined,
				voteCount: image['vote_count'] || undefined,
				width: image['width'] || undefined,
		  }))
		: [];
};

export const convertTmdbToLocalPictureDetail = ({
	picture,
	tmdbId,
	imdbId,
	mediaType,
}: ConvertTmdbToLocalPictureArgs): IPictureDetail => {
	return {
		imdbId: imdbId ? imdbId : `temp_id_${mediaType}_${tmdbId}`,
		tmdbId,
		mediaType,
		title: picture['title'] || picture['name'] || undefined,
		originalTitle:
			picture['original_title'] || picture['original_name'] || undefined,
		overview: picture['overview'] || undefined,
		genres: picture['genres']
			? picture['genres'].map((genre) => genre.id)
			: [],
		voteAverage: picture['vote_average'] || undefined,
		voteCount: picture['vote_count'] || undefined,
		backdropPath: picture['backdrop_path'] || undefined,
		posterPath: picture['poster_path'] || undefined,
		releaseDate:
			picture['release_date'] || picture['first_air_date'] || undefined,
		productionCompanies: convertCompany(picture['production_companies']),
		networks: convertCompany(picture['networks']),
		tagline: picture['tagline'] || undefined,
		runtime: picture['runtime'] || undefined,
		budget: picture['budget'] || undefined,
		revenue: picture['revenue'] || undefined,
		releaseStatus: picture['status'] || undefined,
		inProduction: picture['in_production'] || undefined,
		seasons: convertSeason(picture['seasons']),
		seasonsCount: picture['seasons_count'] || undefined,
		episodesCount: picture['episodes_count'] || undefined,
		nextEpisodeDate: picture['next_episode_to_air'] || undefined,
		videos: convertVideo(picture['videos']?.results),
		credits: {
			cast: convertCredit(picture['credits']?.cast),
			crew: convertCredit(picture['credits']?.crew),
		},
		images: {
			backdrops: convertImage(picture['images']?.backdrops),
			logos: convertImage(picture['images']?.logos),
			posters: convertImage(picture['images']?.posters),
		},
		lastUpdate: new Date().toISOString(),
	};
};

export const adapterSearchResult = (picture): IPicture => {
	return {
		tmdbId: picture['tmdbId'],
		mediaType: picture['media_type'],
		title: picture['title'] || picture['name'],
		originalTitle: picture['original_title'] || picture['original_name'],
		overview: picture['overview'] || '',
		genres: picture['genre_ids'] || [],
		voteAverage: picture['vote_average'],
		voteCount: picture['vote_count'],
		backdropPath: picture['backdrop_path'],
		posterPath: picture['poster_path'],
		releaseDate: picture['release_date'] || picture['first_air_date'],
	};
};

////////////////////////////////////////////////////////////////////////////////

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

export const adaptSearchResults = (
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
