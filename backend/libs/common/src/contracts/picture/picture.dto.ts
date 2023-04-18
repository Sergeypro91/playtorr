import {
	IsArray,
	IsString,
	IsOptional,
	ValidateNested,
	IsNumber,
	IsBoolean,
	IsObject,
	IsEnum,
} from 'class-validator';
import {
	ICompany,
	ICredits,
	IImage,
	IImages,
	IMovieSlim,
	IPeople,
	IPersonSlim,
	IPicture,
	IPictureDetail,
	ISeason,
	ITvSlim,
	IVideo,
} from '@app/common';
import { MediaType, TimeWindow } from '@app/common/types';
import { Type } from 'class-transformer';
import { OmitType } from '@nestjs/swagger';

export class SearchRequestDto {
	@IsString()
	query: string;

	@IsOptional()
	@IsString()
	page?: string;
}

export class GetPictureTrendsDto {
	@IsEnum(MediaType)
	mediaType: MediaType;

	@IsEnum(TimeWindow)
	timeWindow: TimeWindow;

	@IsOptional()
	@IsString()
	page?: string;
}

export class GetPictureTrendsApiGatewayDto extends OmitType(
	GetPictureTrendsDto,
	['page'],
) {}

export class MovieSlim implements IMovieSlim {
	@IsOptional()
	@IsString()
	posterPath?: string | null;

	@IsString()
	releaseDate: string; // release_date

	@IsString()
	originalTitle: string; // original_title

	@IsNumber({}, { each: true })
	genres: number[]; // genre_ids

	@IsNumber()
	tmdbId: number; // id

	@IsEnum(MediaType)
	mediaType: MediaType; // media_type

	@IsString()
	title: string;

	@IsNumber()
	popularity: number;

	@IsNumber()
	voteAverage: number; // vote_average
}

export class TvSlim implements ITvSlim {
	@IsOptional()
	@IsString()
	posterPath: string | null; // poster_path

	@IsNumber()
	popularity: number;

	@IsNumber()
	tmdbId: number; // id

	@IsString()
	overview: string;

	@IsNumber()
	voteAverage: number; // vote_average

	@IsEnum(MediaType)
	mediaType: MediaType; // media_type

	@IsString()
	releaseDate: string; // first_air_date

	@IsArray()
	@IsNumber({}, { each: true })
	genres: number[]; // genre_ids

	@IsString()
	title: string; // name

	@IsString()
	originalTitle: string; //original_name
}

export class PersonSlim implements IPersonSlim {
	@IsOptional()
	@IsString()
	profilePath: string | null; // profile_path

	@IsNumber()
	tmdbId: number; // id

	@IsEnum(MediaType)
	mediaType: MediaType; // media_type

	@IsString()
	name: string;

	@IsNumber()
	popularity: number;
}

export class SearchResultDto {
	@IsNumber()
	page: number;

	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => MovieSlim || TvSlim || PersonSlim)
	results: (MovieSlim | TvSlim | PersonSlim)[];

	@IsNumber()
	totalPages: number;

	@IsNumber()
	totalResults: number;
}

export class PictureDataDto implements IPicture {
	@IsString()
	tmdbId: string;

	@IsEnum(MediaType)
	mediaType: MediaType;

	@IsOptional()
	@IsString()
	title?: string;

	@IsOptional()
	@IsString()
	originalTitle?: string;

	@IsOptional()
	@IsString()
	overview?: string;

	@IsArray()
	genres: number[];

	@IsOptional()
	@IsNumber()
	voteAverage?: number;

	@IsOptional()
	@IsNumber()
	voteCount?: number;

	@IsOptional()
	@IsString()
	backdropPath?: string;

	@IsOptional()
	@IsString()
	posterPath?: string;

	@IsOptional()
	@IsString()
	releaseDate?: string;
}

export class CompanyDto implements ICompany {
	@IsOptional()
	@IsString()
	logoPath?: string;

	@IsString()
	name: string;
}

export class SeasonDto implements ISeason {
	@IsString()
	releaseDate: string;

	@IsString()
	episodeCount: number;

	@IsString()
	name: string;

	@IsOptional()
	@IsString()
	overview?: string;

	@IsOptional()
	@IsString()
	posterPath?: string;

	@IsString()
	seasonNumber: number;
}

export class VideoDto implements IVideo {
	@IsOptional()
	@IsString()
	iso?: string;

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

export class PeopleDto implements IPeople {
	@IsNumber()
	peopleId: number;

	@IsString()
	position: string;

	@IsString()
	name: string;

	@IsString()
	originalName: string;

	@IsOptional()
	@IsString()
	photo?: string;

	@IsOptional()
	@IsString()
	character?: string;
}

export class CreditsDto implements ICredits {
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => PeopleDto)
	cast: PeopleDto[];

	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => PeopleDto)
	crew: PeopleDto[];
}

export class ImageDto implements IImage {
	@IsNumber()
	aspectRatio: number;

	@IsNumber()
	height: number;

	@IsOptional()
	@IsString()
	iso?: string;

	@IsOptional()
	@IsString()
	filePath?: string;

	@IsNumber()
	voteAverage: number;

	@IsNumber()
	voteCount: number;

	@IsNumber()
	width: number;
}

export class ImagesDto implements IImages {
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => ImageDto)
	backdrops: ImageDto[];

	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => ImageDto)
	logos: ImageDto[];

	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => ImageDto)
	posters: ImageDto[];
}

export class GetPictureDataDto {
	@IsString()
	tmdbId: string;

	@IsEnum(MediaType)
	mediaType: MediaType;
}

export class PictureDetailDataDto
	extends PictureDataDto
	implements IPictureDetail
{
	@IsString()
	imdbId: string;

	@IsOptional()
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => CompanyDto)
	productionCompanies?: CompanyDto[];

	@IsOptional()
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => CompanyDto)
	networks?: CompanyDto[];

	@IsOptional()
	@IsString()
	tagline?: string;

	@IsOptional()
	@IsNumber()
	runtime?: number;

	@IsOptional()
	@IsNumber()
	budget?: number;

	@IsOptional()
	@IsNumber()
	revenue?: number;

	@IsOptional()
	@IsString()
	releaseStatus?: string;

	@IsOptional()
	@IsBoolean()
	inProduction?: boolean;

	@IsOptional()
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => SeasonDto)
	seasons?: SeasonDto[];

	@IsOptional()
	@IsNumber()
	seasonsCount?: number;

	@IsOptional()
	@IsNumber()
	episodesCount?: number;

	@IsOptional()
	@IsString()
	nextEpisodeDate?: string;

	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => VideoDto)
	videos: VideoDto[];

	@IsObject()
	@ValidateNested()
	@Type(() => CreditsDto)
	credits: CreditsDto;

	@IsObject()
	@ValidateNested()
	@Type(() => ImagesDto)
	images: ImagesDto;

	@IsString()
	lastUpdate: string;
}
