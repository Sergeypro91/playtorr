import { ICompany, ICredits, IImages, ISeason, IVideo } from '@app/interfaces';

export type MediaType = 'movie' | 'tv';

export interface IPicture {
	tmdbId: number;
	mediaType: MediaType;
	title: string;
	originalTitle: string;
	overview: string;
	genres: number[];
	voteAverage: number;
	voteCount: number;
	backdropPath: string;
	posterPath: string;
	releaseDate: string;
}

export interface IPictureDetail extends IPicture {
	imdbId: string;
	productionCompanies: ICompany[];
	networks?: ICompany[];
	tagline: string;
	runtime?: number; // MOVIE
	budget?: number; // MOVIE
	revenue?: number; // MOVIE
	releaseStatus?: string; // MOVIE
	inProduction?: boolean; // TV
	seasons?: ISeason[]; // TV
	seasonsCount?: number; // TV
	episodesCount?: number; // TV
	nextEpisodeDate?: string; // TV
	video: IVideo[];
	credits: ICredits;
	images: IImages;
	lastUpdate: string;
}
