import {
	ICompany,
	IPictureDetail,
	MediaType,
	ISeason,
	IVideo,
	ICredits,
	IImages,
} from '@app/interfaces/picture';

export class PictureEntity implements IPictureDetail {
	imdbId: string;
	tmdbId: string;
	mediaType: MediaType;
	title: string;
	originalTitle: string;
	overview: string;
	genres: number[];
	voteAverage: number;
	voteCount: number;
	backdropPath?: string;
	posterPath?: string;
	releaseDate?: string;
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

	constructor(picture) {
		this.imdbId = picture.imdbId;
		this.tmdbId = picture.tmdbId;
		this.mediaType = picture.mediaType;
		this.title = picture.title;
		this.originalTitle = picture.originalTitle;
		this.overview = picture.overview;
		this.genres = picture.genres;
		this.voteAverage = picture.voteAverage;
		this.voteCount = picture.voteCount;
		this.backdropPath = picture.backdropPath;
		this.posterPath = picture.posterPath;
		this.releaseDate = picture.releaseDate;
		this.productionCompanies = picture.productionCompanies;
		this.networks = picture.networks;
		this.tagline = picture.tagline;
		this.runtime = picture.runtime;
		this.budget = picture.budget;
		this.revenue = picture.revenue;
		this.releaseStatus = picture.releaseStatus;
		this.inProduction = picture.inProduction;
		this.seasons = picture.seasons;
		this.seasonsCount = picture.seasonsCount;
		this.episodesCount = picture.episodesCount;
		this.nextEpisodeDate = picture.nextEpisodeDate;
		this.videos = picture.videos;
		this.credits = picture.credits;
		this.images = picture.images;
		this.lastUpdate = picture.lastUpdate;
	}

	// public setSearchStatus(
	// 	imdbId: string,
	// 	searchQuery: string,
	// 	searchStatus: SearchStatus,
	// ) {}
}
