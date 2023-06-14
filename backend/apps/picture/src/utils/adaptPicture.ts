import {
	ICompany,
	ICreatedBy,
	IEpisodeToAir,
	IImage,
	IMovie,
	IParticipantPerson,
	ISeason,
	ITv,
	IVideo,
} from '@app/common';
import { MediaType } from '@app/common/types';
import { PictureEntity } from '../entities';

const adaptCompany = (company): ICompany => {
	return {
		id: company['id'],
		name: company['name'],
		logoPath: company['logoPath'],
	};
};

const adaptVideo = (video: unknown): IVideo => {
	return {
		iso: video['iso_639_1'],
		name: video['name'],
		key: video['key'],
		site: video['site'],
		size: video['size'],
		type: video['type'],
		official: video['official'],
		publishedAt: video['published_at'],
	};
};

const adaptCredit = (person: unknown): IParticipantPerson => {
	return {
		tmdbId: person['id'],
		name: person['name'],
		originalName: person['original_name'],
		popularity: person['popularity'],
		profilePath: person['profile_path'],
	};
};

const adaptImage = (image: unknown): IImage => {
	return {
		aspectRatio: image['aspect_ratio'],
		filePath: image['file_path'],
		height: image['height'],
		iso: image['iso_639_1'],
		voteAverage: image['vote_average'],
		width: image['width'],
	};
};

const adaptCreatedBy = (by: unknown): ICreatedBy => {
	return {
		tmdbId: by['id'],
		name: by['name'],
		profilePath: by['profile_path'],
	};
};

const adaptSeason = (season: unknown): ISeason => {
	return {
		airDate: season['air_date'],
		episodeCount: season['episode_count'],
		id: season['id'],
		name: season['name'],
		overview: season['overview'],
		posterPath: season['poster_path'],
		seasonNumber: season['season_number'],
	};
};

const adaptEpisodeToAirDto = (episode: unknown): IEpisodeToAir => {
	return {
		airDate: episode?.['air_date'] || '',
		episodeNumber: episode['episode_number'],
		id: episode['id'],
		name: episode['name'],
		overview: episode['overview'],
		seasonNumber: episode['season_number'],
		stillPath: episode['still_path'],
		voteAverage: episode['vote_average'],
	};
};

const adaptToMovie = (data: unknown): IMovie => {
	return {
		backdropPath: data['backdrop_path'],
		budget: data['budget'],
		genres: data['genres'],
		originalTitle: data['original_title'],
		overview: data['overview'],
		popularity: data['popularity'],
		posterPath: data['poster_path'],
		productionCompanies: data['production_companies'].map((company) =>
			adaptCompany(company),
		),
		releaseDate: data['release_date'],
		revenue: data['revenue'],
		runtime: data['runtime'],
		status: data['status'],
		tagline: data['tagline'],
		title: data['title'],
		voteAverage: data['vote_average'],
		videos: {
			results:
				data['videos']?.results.map((video) => adaptVideo(video)) || [],
		},
		credits: {
			cast:
				data['credits']?.cast.map((person) => adaptCredit(person)) ||
				[],
			crew:
				data['credits']?.crew.map((person) => adaptCredit(person)) ||
				[],
		},
		images: {
			backdrops:
				data['images']?.backdrops.map((person) => adaptImage(person)) ||
				[],
			logos:
				data['images']?.logos.map((person) => adaptImage(person)) || [],
			posters:
				data['images']?.posters.map((person) => adaptImage(person)) ||
				[],
		},
	};
};

const adaptTv = (data: unknown): ITv => {
	return {
		backdropPath: data['backdrop_path'],
		createdBy: data['created_by']?.map((by) => adaptCreatedBy(by)) || [],
		episodeRunTime: data['episodeRunTime'],
		firstAirDate: data['first_air_date'],
		genres: data['genres'],
		inProduction: data['in_production'],
		lastAirDate: data['last_air_date'],
		lastEpisodeToAir: adaptEpisodeToAirDto(data['last_episode_to_air']),
		name: data['name'],
		networks: data['networks'].map((company) => adaptCompany(company)),
		numberOfEpisodes: data['number_of_episodes'],
		numberOfSeasons: data['number_of_seasons'],
		originalName: data['original_name'],
		overview: data['overview'],
		popularity: data['popularity'],
		posterPath: data['poster_path'],
		productionCompanies: data['production_companies'].map((company) =>
			adaptCompany(company),
		),
		seasons: data['seasons']?.map((season) => adaptSeason(season)) || [],
		status: data['status'],
		tagline: data['tagline'],
		type: data['type'],
		voteAverage: data['vote_average'],
		videos: {
			results:
				data['videos']?.results.map((video) => adaptVideo(video)) || [],
		},
		credits: {
			cast:
				data['credits']?.cast.map((person) => adaptCredit(person)) ||
				[],
			crew:
				data['credits']?.crew.map((person) => adaptCredit(person)) ||
				[],
		},
		images: {
			backdrops:
				data['images']?.backdrops.map((person) => adaptImage(person)) ||
				[],
			logos:
				data['images']?.logos.map((person) => adaptImage(person)) || [],
			posters:
				data['images']?.posters.map((person) => adaptImage(person)) ||
				[],
		},
	};
};

type AdaptPictureArgs = {
	pictureData: unknown;
	mediaType: MediaType;
};

export const adaptPicture = ({
	pictureData,
	mediaType,
}: AdaptPictureArgs): PictureEntity => {
	const adaptPictureData = (data): IMovie | ITv => {
		switch (mediaType) {
			case MediaType.MOVIE:
				return adaptToMovie(data);
			case MediaType.TV:
				return adaptTv(data);
		}
	};

	return {
		tmdbId: pictureData['id'],
		imdbId:
			pictureData?.['imdb_id'] ||
			`tempId-${pictureData['id']}/${
				pictureData?.['media_type'] || mediaType
			}`,
		mediaType: pictureData?.['media_type'] || mediaType,
		pictureData: adaptPictureData(pictureData),
	};
};
