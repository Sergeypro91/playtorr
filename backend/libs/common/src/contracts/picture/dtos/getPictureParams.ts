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
import { ApiModelPropertyOptional } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import {
	ApiProperty,
	IntersectionType,
	OmitType,
	PickType,
} from '@nestjs/swagger';

// MOVIE
export class GenresDto implements IGenre {
	@ApiProperty()
	@IsNumber()
	id: number;

	@ApiProperty()
	@IsString()
	name: string;
}

export class CompanyDto implements ICompany {
	@ApiProperty()
	@IsNumber()
	id: number;

	@ApiProperty()
	@IsString()
	name: string;

	@ApiProperty({ nullable: true })
	@IsOptional()
	@IsString()
	logoPath: string | null; // logo_path
}

export class VideoDto implements IVideo {
	@ApiModelPropertyOptional()
	@IsOptional()
	@IsString()
	iso?: string; // iso_639_1

	@ApiProperty()
	@IsString()
	name: string;

	@ApiProperty()
	@IsString()
	key: string;

	@ApiProperty()
	@IsString()
	site: string;

	@ApiProperty()
	@IsString()
	size: number;

	@ApiProperty()
	@IsString()
	type: string;

	@ApiProperty()
	@IsBoolean()
	official: boolean;

	@ApiProperty()
	@IsString()
	publishedAt: string;
}

export class ParticipantPersonDto implements IParticipantPerson {
	@ApiProperty()
	@IsNumber()
	tmdbId: number;

	@ApiProperty()
	@IsString()
	name: string;

	@ApiProperty()
	@IsString()
	originalName: string; // original_name

	@ApiProperty()
	@IsNumber()
	popularity: number;

	@ApiProperty({ nullable: true })
	@IsOptional()
	@IsString()
	profilePath: string | null; // profile_path
}

export class CreditsDto implements ICredits {
	@ApiProperty({ type: [ParticipantPersonDto] })
	@IsArray()
	@Type(() => ParticipantPersonDto)
	cast: ParticipantPersonDto[];

	@ApiProperty({ type: [ParticipantPersonDto] })
	@IsArray()
	@Type(() => ParticipantPersonDto)
	crew: ParticipantPersonDto[];
}

export class ImageDto implements IImage {
	@ApiProperty()
	@IsNumber()
	aspectRatio: number; // aspect_ratio

	@ApiProperty()
	@IsString()
	filePath: string; // file_path

	@ApiProperty()
	@IsNumber()
	height: number;

	@ApiProperty({ nullable: true })
	@IsOptional()
	@IsString()
	iso: string | null; // iso_639_1

	@ApiProperty()
	@IsNumber()
	voteAverage: number; // vote_average

	@ApiProperty()
	@IsNumber()
	width: number;
}

export class ImagesDto implements IImages {
	@ApiProperty({ type: [ImageDto] })
	@IsArray()
	@Type(() => ImageDto)
	backdrops: ImageDto[];

	@ApiProperty({ type: [ImageDto] })
	@IsArray()
	@Type(() => ImageDto)
	logos: ImageDto[];

	@ApiProperty({ type: [ImageDto] })
	@IsArray()
	@Type(() => ImageDto)
	posters: ImageDto[];
}

export class ResultsVideoObjDto implements IResultsVideoObj {
	@ApiProperty({ type: [VideoDto] })
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => VideoDto)
	results: VideoDto[];
}

export class MovieDto implements IMovie {
	@ApiProperty({ nullable: true })
	@IsOptional()
	@IsString()
	backdropPath: string | null; // backdrop_path

	@ApiProperty()
	@IsNumber()
	budget: number;

	@ApiProperty({ type: [GenresDto] })
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => GenresDto)
	genres: GenresDto[];

	@ApiProperty()
	@IsString()
	originalTitle: string; // original_title

	@ApiProperty({ nullable: true })
	@IsOptional()
	@IsString()
	overview: string | null;

	@ApiProperty()
	@IsNumber()
	popularity: number;

	@ApiProperty({ nullable: true })
	@IsOptional()
	@IsString()
	posterPath: string | null; // poster_path

	@ApiProperty({ type: [CompanyDto] })
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => CompanyDto)
	productionCompanies: CompanyDto[]; // production_companies

	@ApiProperty()
	@IsDateString()
	releaseDate: string; // release_date

	@ApiProperty()
	@IsNumber()
	revenue: number;

	@ApiProperty({ nullable: true })
	@IsOptional()
	@IsNumber()
	runtime: number | null;

	@ApiProperty({ enum: PictureStatus })
	@IsEnum(PictureStatus)
	status: PictureStatus;

	@ApiProperty({ nullable: true })
	@IsOptional()
	@IsString()
	tagline: string | null;

	@ApiProperty()
	@IsString()
	title: string;

	@ApiProperty()
	@IsNumber()
	voteAverage: number; // vote_average

	@ApiProperty({ type: ResultsVideoObjDto })
	@IsObject()
	@ValidateNested()
	@Type(() => ResultsVideoObjDto)
	videos: ResultsVideoObjDto;

	@ApiProperty({ type: CreditsDto })
	@IsObject()
	@ValidateNested()
	@Type(() => CreditsDto)
	credits: CreditsDto;

	@ApiProperty({ type: ImagesDto })
	@IsObject()
	@ValidateNested()
	@Type(() => ImagesDto)
	images: ImagesDto;
}

// TV

export class CreatedByDto implements ICreatedBy {
	@ApiProperty()
	@IsNumber()
	tmdbId: number;

	@ApiProperty()
	@IsString()
	name: string;

	@ApiProperty({ type: ImagesDto })
	@IsOptional()
	@IsString()
	profilePath: string | null; // profile_path
}

export class EpisodeToAirDto implements IEpisodeToAir {
	@ApiProperty()
	@IsString()
	airDate: string; // air_date

	@ApiProperty()
	@IsNumber()
	episodeNumber: number; // episode_number

	@ApiProperty()
	@IsNumber()
	id: number;

	@ApiProperty()
	@IsString()
	name: string;

	@ApiProperty()
	@IsString()
	overview: string;

	@ApiProperty()
	@IsNumber()
	seasonNumber: number; // season_number

	@ApiProperty({ nullable: true })
	@IsOptional()
	@IsString()
	stillPath: string | null; // still_path

	@ApiProperty()
	@IsNumber()
	voteAverage: number; // vote_average
}

export class SeasonDto implements ISeason {
	@ApiProperty()
	@IsString()
	airDate: string; // air_date

	@ApiProperty()
	@IsNumber()
	episodeCount: number; // episode_count

	@ApiProperty()
	@IsNumber()
	id: number;

	@ApiProperty()
	@IsString()
	name: string;

	@ApiProperty()
	@IsString()
	overview: string;

	@ApiProperty({ nullable: true })
	@IsOptional()
	@IsString()
	posterPath: string | null; // poster_path

	@ApiProperty()
	@ApiProperty()
	@IsNumber()
	seasonNumber: number; // season_number
}

export class TvDto implements ITv {
	@ApiProperty({ nullable: true })
	@IsOptional()
	@IsString()
	backdropPath: string | null; // backdrop_path

	@ApiProperty({ type: [CreatedByDto] })
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => CreatedByDto)
	createdBy: CreatedByDto[]; // created_by

	@ApiProperty({ type: [Number] })
	@IsArray()
	@IsNumber()
	episodeRunTime: number[];

	@ApiProperty()
	@IsDateString()
	firstAirDate: string; // first_air_date

	@ApiProperty({ type: [GenresDto] })
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => GenresDto)
	genres: GenresDto[];

	@ApiProperty()
	@IsBoolean()
	inProduction: boolean; // in_production

	@ApiProperty()
	@IsString()
	lastAirDate: string; // last_air_date

	@ApiProperty({ type: EpisodeToAirDto })
	@IsObject()
	@Type(() => EpisodeToAirDto)
	lastEpisodeToAir: EpisodeToAirDto; // last_episode_to_air

	@ApiProperty()
	@IsString()
	name: string;

	@ApiProperty({ type: [CompanyDto] })
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => CompanyDto)
	networks: CompanyDto[];

	@ApiProperty()
	@ApiProperty()
	@IsNumber()
	numberOfEpisodes: number; // number_of_episodes

	@ApiProperty()
	@ApiProperty()
	@IsNumber()
	numberOfSeasons: number; // number_of_seasons

	@ApiProperty()
	@IsString()
	originalName: string; // original_name

	@ApiProperty({ nullable: true })
	@IsOptional()
	@IsString()
	overview: string | null;

	@ApiProperty()
	@IsNumber()
	popularity: number;

	@ApiProperty({ nullable: true })
	@IsOptional()
	@IsString()
	posterPath: string | null; // poster_path

	@ApiProperty({ type: [CompanyDto] })
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => CompanyDto)
	productionCompanies: CompanyDto[]; // production_companies

	@ApiProperty({ type: [SeasonDto] })
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => SeasonDto)
	seasons: SeasonDto[];

	@ApiProperty()
	@IsString()
	status: string;

	@ApiProperty({ nullable: true })
	@IsOptional()
	@IsString()
	tagline: string | null;

	@ApiProperty()
	@ApiProperty()
	@IsString()
	type: string;

	@ApiProperty()
	@ApiProperty()
	@IsNumber()
	voteAverage: number; // vote_average

	@ApiProperty({ type: ResultsVideoObjDto })
	@IsObject()
	@ValidateNested()
	@Type(() => ResultsVideoObjDto)
	videos: ResultsVideoObjDto;

	@ApiProperty({ type: CreditsDto })
	@IsObject()
	@ValidateNested()
	@Type(() => CreditsDto)
	credits: CreditsDto;

	@ApiProperty({ type: ImagesDto })
	@IsObject()
	@ValidateNested()
	@Type(() => ImagesDto)
	images: ImagesDto;
}

export class GetPictureParams extends OmitType(BasePictureDto, ['imdbId']) {}

export class GetPictureQueries extends PickType(BasePictureDto, ['imdbId']) {
	@ApiModelPropertyOptional({
		description:
			'May contain additional data in the request - "videos,images,credits"',
	})
	@IsOptional()
	@IsString()
	appends?: string;
}

export class GetPictureRequestDto extends IntersectionType(
	GetPictureParams,
	GetPictureQueries,
) {}

export class GetPictureResponseDto extends BasePictureDto implements IPicture {
	@ApiProperty({ type: MovieDto || TvDto })
	@IsObject()
	pictureData: MovieDto | TvDto;
}
