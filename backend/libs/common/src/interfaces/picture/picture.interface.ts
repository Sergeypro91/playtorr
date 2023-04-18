import { ICompany, ICredits, IImages, ISeason, IVideo } from '@app/common';
import { MediaType } from '@app/common/types';

export interface PictureIdType {
	tmdbId: string;
	mediaType: MediaType;
}

export interface IMovieSlim {
	posterPath?: string | null;
	releaseDate: string;
	originalTitle: string;
	genres: number[];
	tmdbId: number;
	mediaType: MediaType;
	title: string;
	popularity: number;
	voteAverage: number;
}

export interface ITvSlim {
	posterPath: string | null;
	popularity: number;
	tmdbId: number;
	overview: string;
	voteAverage: number;
	mediaType: MediaType;
	releaseDate: string;
	genres: number[];
	title: string;
	originalTitle: string;
}

export interface IPersonSlim {
	profilePath: string | null;
	tmdbId: number;
	mediaType: MediaType;
	name: string;
	popularity: number;
}

export interface IPicture extends PictureIdType {
	title?: string;
	originalTitle?: string;
	overview?: string;
	genres: number[];
	voteAverage?: number;
	voteCount?: number;
	backdropPath?: string;
	posterPath?: string;
	releaseDate?: string;
}

export interface IPictureDetail extends IPicture {
	imdbId: string;
	productionCompanies?: ICompany[];
	networks?: ICompany[];
	tagline?: string;
	runtime?: number; // MOVIE
	budget?: number; // MOVIE
	revenue?: number; // MOVIE
	releaseStatus?: string; // MOVIE
	inProduction?: boolean; // TV
	seasons?: ISeason[]; // TV
	seasonsCount?: number; // TV
	episodesCount?: number; // TV
	nextEpisodeDate?: string; // TV
	videos: IVideo[];
	credits: ICredits;
	images: IImages;
	lastUpdate: string;
}
