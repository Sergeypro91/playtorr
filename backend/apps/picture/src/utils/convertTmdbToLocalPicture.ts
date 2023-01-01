import {
	ICompany,
	IImage,
	IPeople,
	IPictureDetail,
	ISeason,
	IVideo,
	MediaType,
} from '@app/interfaces';

export type ConvertTmdbToLocalPictureArgs = {
	picture: { unknown };
	tmdbId: number;
	imdbId: string;
	mediaType: MediaType;
};

const convertCompany = (company?: []): ICompany[] | undefined => {
	return company
		? company.map((company) => ({
				logoPath: company['logo_path'] || '',
				name: company['name'] || '',
		  }))
		: undefined;
};

const convertSeason = (seasons?: []): ISeason[] | undefined => {
	return seasons
		? seasons.map((season) => ({
				releaseDate: season['air_date'] || '',
				episodeCount: season['episodeCount'] || 0,
				name: season['name'] || '',
				overview: season['overview'] || '',
				posterPath: season['poster_path'] || '',
				seasonNumber: season['season_number'] || 0,
		  }))
		: undefined;
};

const convertVideo = (videos?: []): IVideo[] => {
	return videos
		? videos.map((video) => ({
				iso: video['iso_639_1'],
				name: video['name'],
				key: video['key'],
				site: video['site'],
				size: video['size'],
				type: video['type'],
				official: video['official'],
				publishedAt: video['published_at'],
		  }))
		: [];
};

const convertCredit = (credits: []): IPeople[] => {
	return credits.map((credit) => ({
		peopleId: credit['id'],
		position: credit['known_for_department'],
		name: credit['name'],
		originalName: credit['original_name'],
		photo: credit['profile_path'],
		character: credit['character'],
	}));
};

const convertImage = (images: []): IImage[] => {
	return images.map((image) => ({
		aspectRatio: image['aspect_ratio'],
		height: image['height'],
		iso: image['iso_639_1'],
		filePath: image['file_path'],
		voteAverage: image['vote_average'],
		voteCount: image['vote_count'],
		width: image['width'],
	}));
};

export const convertTmdbToLocalPicture = ({
	picture,
	tmdbId,
	imdbId,
	mediaType,
}: ConvertTmdbToLocalPictureArgs): IPictureDetail => {
	return {
		imdbId: imdbId ? imdbId : `temp_id_${tmdbId}`,
		tmdbId,
		mediaType,
		title: picture['title'] || picture['name'],
		originalTitle: picture['original_title'] || picture['original_name'],
		overview: picture['overview'] || '',
		genres: picture['genres']
			? picture['genres'].map((genre) => genre.id)
			: [],
		voteAverage: picture['vote_average'],
		voteCount: picture['vote_count'],
		backdropPath: picture['backdrop_path'],
		posterPath: picture['poster_path'],
		releaseDate: picture['release_date'] || picture['first_air_date'],
		productionCompanies: convertCompany(picture['production_companies']),
		networks: convertCompany(picture['networks']),
		tagline: picture['tagline'],
		runtime: picture['runtime'],
		budget: picture['budget'],
		revenue: picture['revenue'],
		releaseStatus: picture['status'],
		inProduction: picture['in_production'],
		seasons: convertSeason(picture['seasons']),
		seasonsCount: picture['seasons_count'],
		episodesCount: picture['episodes_count'],
		nextEpisodeDate: picture['next_episode_to_air'],
		videos: convertVideo(picture['videos'].results),
		credits: {
			cast: convertCredit(picture['credits'].cast),
			crew: convertCredit(picture['credits'].crew),
		},
		images: {
			backdrops: convertImage(picture['images'].backdrops),
			logos: convertImage(picture['images'].logos),
			posters: convertImage(picture['images'].posters),
		},
		lastUpdate: new Date().toISOString(),
	};
};
