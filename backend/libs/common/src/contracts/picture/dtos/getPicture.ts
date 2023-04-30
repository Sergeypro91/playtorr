import {
	IsArray,
	IsBoolean,
	IsDateString,
	IsEnum,
	IsNumber,
	IsObject,
	IsOptional,
	IsString,
	ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PictureStatus } from '@app/common/types';
import {
	ICredits,
	IGenre,
	IImage,
	IImages,
	IMovie,
	ICreatedBy,
	IParticipantPerson,
	ICompany,
	IVideo,
	IEpisodeToAir,
	ISeason,
	ITv,
	IPicture,
	IResultsVideoObj,
} from '@app/common/interfaces';
import { BasePictureDto } from '../../base.dto';

export class GetPicture extends BasePictureDto {}

export class PictureDto extends BasePictureDto implements IPicture {
	@IsObject()
	pictureData: MovieDto | TvDto;
}

// MOVIE

export class GenresDto implements IGenre {
	@IsNumber()
	id: number;

	@IsString()
	name: string;
}

export class CompanyDto implements ICompany {
	@IsNumber()
	id: number;

	@IsString()
	name: string;

	@IsOptional()
	@IsString()
	logoPath: string | null; // logo_path
}

export class VideoDto implements IVideo {
	@IsOptional()
	@IsString()
	iso?: string; // iso_639_1

	@IsString()
	name: string;

	@IsString()
	key: string;

	@IsString()
	site: string;

	@IsString()
	size: number;

	@IsString()
	type: string;

	@IsBoolean()
	official: boolean;

	@IsString()
	publishedAt: string;
}

export class ParticipantPersonDto implements IParticipantPerson {
	@IsNumber()
	tmdbId: number;

	@IsString()
	name: string;

	@IsString()
	originalName: string; // original_name

	@IsNumber()
	popularity: number;

	@IsOptional()
	@IsString()
	profilePath: string | null; // profile_path
}

export class CreditsDto implements ICredits {
	@IsArray()
	@Type(() => ParticipantPersonDto)
	cast: ParticipantPersonDto[];

	@IsArray()
	@Type(() => ParticipantPersonDto)
	crew: ParticipantPersonDto[];
}

export class ImageDto implements IImage {
	@IsNumber()
	aspectRatio: number; // aspect_ratio

	@IsString()
	filePath: string; // file_path

	@IsNumber()
	height: number;

	@IsOptional()
	@IsString()
	iso: string | null; // iso_639_1

	@IsNumber()
	voteAverage: number; // vote_average

	@IsNumber()
	width: number;
}

export class ImagesDto implements IImages {
	@IsArray()
	@Type(() => ImageDto)
	backdrops: ImageDto[];

	@IsArray()
	@Type(() => ImageDto)
	logos: ImageDto[];

	@IsArray()
	@Type(() => ImageDto)
	posters: ImageDto[];
}

export class ResultsVideoObjDto implements IResultsVideoObj {
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => VideoDto)
	results: VideoDto[];
}

export class MovieDto implements IMovie {
	@IsOptional()
	@IsString()
	backdropPath: string | null; // backdrop_path

	@IsNumber()
	budget: number;

	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => GenresDto)
	genres: GenresDto[];

	@IsString()
	originalTitle: string; // original_title

	@IsOptional()
	@IsString()
	overview: string | null;

	@IsNumber()
	popularity: number;

	@IsOptional()
	@IsString()
	posterPath: string | null; // poster_path

	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => CompanyDto)
	productionCompanies: CompanyDto[]; // production_companies

	@IsDateString()
	releaseDate: string; // release_date

	@IsNumber()
	revenue: number;

	@IsOptional()
	@IsNumber()
	runtime: number | null;

	@IsEnum(PictureStatus)
	status: PictureStatus;

	@IsOptional()
	@IsString()
	tagline: string | null;

	@IsString()
	title: string;

	@IsNumber()
	voteAverage: number; // vote_average

	@IsObject()
	@ValidateNested()
	@Type(() => ResultsVideoObjDto)
	videos: ResultsVideoObjDto;

	@IsObject()
	@ValidateNested()
	@Type(() => CreditsDto)
	credits: CreditsDto;

	@IsObject()
	@ValidateNested()
	@Type(() => ImagesDto)
	images: ImagesDto;
}

// TV

export class CreatedByDto implements ICreatedBy {
	@IsNumber()
	tmdbId: number;

	@IsString()
	name: string;

	@IsOptional()
	@IsString()
	profilePath: string | null; // profile_path
}

export class EpisodeToAirDto implements IEpisodeToAir {
	@IsString()
	airDate: string; // air_date

	@IsNumber()
	episodeNumber: number; // episode_number

	@IsNumber()
	id: number;

	@IsString()
	name: string;

	@IsString()
	overview: string;

	@IsNumber()
	seasonNumber: number; // season_number

	@IsOptional()
	@IsString()
	stillPath: string | null; // still_path

	@IsNumber()
	voteAverage: number; // vote_average
}

export class SeasonDto implements ISeason {
	@IsString()
	airDate: string; // air_date

	@IsNumber()
	episodeCount: number; // episode_count

	@IsNumber()
	id: number;

	@IsString()
	name: string;

	@IsString()
	overview: string;

	@IsOptional()
	@IsString()
	posterPath: string | null; // poster_path

	@IsNumber()
	seasonNumber: number; // season_number
}

export class TvDto implements ITv {
	@IsOptional()
	@IsString()
	backdropPath: string | null; // backdrop_path

	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => CreatedByDto)
	createdBy: CreatedByDto[]; // created_by

	@IsArray()
	@IsNumber()
	episodeRunTime: number[];

	@IsDateString()
	firstAirDate: string; // first_air_date

	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => GenresDto)
	genres: GenresDto[];

	@IsBoolean()
	inProduction: boolean; // in_production

	@IsString()
	lastAirDate: string; // last_air_date

	@IsObject()
	@Type(() => EpisodeToAirDto)
	lastEpisodeToAir: EpisodeToAirDto; // last_episode_to_air

	@IsString()
	name: string;

	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => CompanyDto)
	networks: CompanyDto[];

	@IsNumber()
	numberOfEpisodes: number; // number_of_episodes

	@IsNumber()
	numberOfSeasons: number; // number_of_seasons

	@IsString()
	originalName: string; // original_name

	@IsOptional()
	@IsString()
	overview: string | null;

	@IsNumber()
	popularity: number;

	@IsOptional()
	@IsString()
	posterPath: string | null; // poster_path

	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => CompanyDto)
	productionCompanies: CompanyDto[]; // production_companies

	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => SeasonDto)
	seasons: SeasonDto[];

	@IsString()
	status: string;

	@IsOptional()
	@IsString()
	tagline: string | null;

	@IsString()
	type: string;

	@IsNumber()
	voteAverage: number; // vote_average

	@IsObject()
	@ValidateNested()
	@Type(() => ResultsVideoObjDto)
	videos: ResultsVideoObjDto;

	@IsObject()
	@ValidateNested()
	@Type(() => CreditsDto)
	credits: CreditsDto;

	@IsObject()
	@ValidateNested()
	@Type(() => ImagesDto)
	images: ImagesDto;
}
