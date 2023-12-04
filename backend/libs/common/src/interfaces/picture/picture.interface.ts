import { MediaType, PictureStatus } from '@app/common/types';

export interface PictureIdType {
	tmdbId: string;
	mediaType: MediaType;
}

export interface IMovieSlim {
	tmdbId: string;
	mediaType: MediaType.MOVIE;
	posterPath: string | null;
	hPosterPath: string | null;
	backdropPath: string | null;
	title: string;
	originalTitle: string;
	overview: string | null;
	genres: number[];
	releaseDate: string;
	popularity: number;
	voteAverage: number;
	trailer: string | null;
}

export interface ITvSlim {
	tmdbId: string;
	mediaType: MediaType.TV;
	posterPath: string | null;
	hPosterPath: string | null;
	backdropPath: string | null;
	title: string;
	originalTitle: string;
	overview: string | null;
	genres: number[];
	releaseDate: string;
	popularity: number;
	voteAverage: number;
	trailer: string | null;
}

export interface IPersonSlim {
	tmdbId: string;
	mediaType: MediaType.PERSON;
	name: string;
	profilePath: string | null;
	popularity: number;
}

export interface IExternalsIds {
	tmdbId: string;
	imdbId?: string | null;
}

export interface IPicture extends IExternalsIds {
	mediaType: MediaType;
	pictureData: IMovie | ITv;
}

export interface IGenre {
	id: number;
	name: string;
}

export interface ICompany {
	id: number;
	name: string;
	logoPath: string | null;
}

export interface IVideo {
	iso?: string;
	name: string;
	key: string;
	site: string;
	size: number;
	type: string;
	official: boolean;
	publishedAt: string;
}

export interface IParticipantPerson {
	tmdbId: number; // id
	department: string; // known_for_department
	job: string; // known_for_department
	name: string;
	originalName: string;
	character: string | null;
	popularity: number;
	profilePath: string | null;
}

export interface ICredits {
	cast: IParticipantPerson[];
	crew: IParticipantPerson[];
}

export interface IImage {
	aspectRatio: number;
	filePath: string;
	height: number;
	iso: string | null;
	voteAverage: number;
	width: number;
}

export interface IImages {
	backdrops: IImage[];
	logos: IImage[];
	posters: IImage[];
}

export interface IMovie {
	backdropPath: string | null;
	budget: number;
	genres: IGenre[];
	originalTitle: string;
	overview: string | null;
	popularity: number;
	posterPath: string | null;
	production: ICompany[];
	releaseDate: string;
	revenue: number;
	runtime: number | null;
	status: PictureStatus;
	tagline: string | null;
	title: string;
	voteAverage: number;
	videos: IResultsVideoObj;
	credits: ICredits;
	images: IImages;
}

// TV

export interface ICreatedBy {
	tmdbId: number;
	name: string;
	profilePath: string | null;
}

export interface IEpisodeToAir {
	airDate: string;
	episodeNumber: number;
	id: number;
	name: string;
	overview: string;
	seasonNumber: number;
	stillPath: string | null;
	voteAverage: number;
}

export interface ISeason {
	airDate: string;
	episodeCount: number;
	id: number;
	name: string;
	overview: string;
	posterPath: string | null;
	seasonNumber: number;
}

export interface IResultsVideoObj {
	results: IVideo[];
}

export interface ITv {
	backdropPath: string | null;
	createdBy: ICreatedBy[];
	episodeRunTime: number[];
	firstAirDate: string;
	genres: IGenre[];
	inProduction: boolean;
	lastAirDate: string;
	lastEpisodeToAir: IEpisodeToAir | null;
	title: string;
	numberOfEpisodes: number;
	numberOfSeasons: number;
	originalName: string;
	overview: string | null;
	popularity: number;
	posterPath: string | null;
	production: ICompany[];
	seasons: ISeason[];
	status: string;
	tagline: string | null;
	type: string;
	voteAverage: number;
	videos: IResultsVideoObj;
	credits: ICredits;
	images: IImages;
}
