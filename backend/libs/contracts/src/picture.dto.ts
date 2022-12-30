import {
	IsArray,
	IsString,
	IsOptional,
	ValidateNested,
	IsNumber,
	IsBoolean,
	IsObject,
} from 'class-validator';
import {
	ICompany,
	ICredits,
	IImage,
	IImages,
	IPeople,
	IPictureDetail,
	ISeason,
	IVideo,
	MediaType,
} from '@app/interfaces';
import { Type } from 'class-transformer';

export class CompanyDto implements ICompany {
	@IsString()
	logoPath: string;

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

	@IsString()
	overview: string;

	@IsString()
	posterPath: string;

	@IsString()
	seasonNumber: number;
}

export class VideoDto implements IVideo {
	@IsString()
	iso: string;

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

	@IsString()
	photo: string;

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

	@IsArray()
	iso: string;

	@IsArray()
	filePath: string;

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
	@IsNumber()
	tmdbId: number;

	@IsString()
	mediaType: MediaType;
}

export class PictureDataDto implements IPictureDetail {
	@IsString()
	imdbId: string;

	@IsNumber()
	tmdbId: number;

	@IsString()
	// TODO Find way to lock on union types mismatch
	mediaType: MediaType;

	@IsString()
	title: string;

	@IsString()
	originalTitle: string;

	@IsString()
	overview: string;

	@IsArray()
	genres: number[];

	@IsNumber()
	voteAverage: number;

	@IsNumber()
	voteCount: number;

	@IsString()
	backdropPath: string;

	@IsString()
	posterPath: string;

	@IsString()
	releaseDate: string;

	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => CompanyDto)
	productionCompanies: CompanyDto[];

	@IsOptional()
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => CompanyDto)
	networks?: CompanyDto[];

	@IsString()
	tagline: string;

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
	video: VideoDto[];

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
