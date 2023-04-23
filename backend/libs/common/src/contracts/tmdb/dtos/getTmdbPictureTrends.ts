import {
	IsArray,
	IsBoolean,
	IsEnum,
	IsNumber,
	IsOptional,
	IsString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationDto } from '@app/common/contracts/base.dto';
import { MediaType, TimeWindow } from '@app/common/types';

export class GetTmdbPictureTrendsDto {
	@IsEnum(MediaType)
	mediaType: MediaType;

	@IsEnum(TimeWindow)
	timeWindow: TimeWindow;

	@IsOptional()
	@IsString()
	page?: string;
}

export class TmdbPictureTrendsDto extends PaginationDto {
	@IsArray()
	@Type(() => TmdbSlimMovieDto || TmdbSlimTvDto)
	results: (TmdbSlimMovieDto | TmdbSlimTvDto)[];
}

export class TmdbSlimPictureDto {
	@IsNumber()
	id: number;

	@IsOptional()
	@IsString()
	poster_path?: string | null;

	@IsNumber()
	popularity: number;

	@IsString()
	overview: string;

	@IsArray()
	@IsNumber({}, { each: true })
	genre_ids: number[];

	@IsOptional()
	@IsString()
	backdrop_path: string | null;

	@IsString()
	original_language: string;

	@IsNumber()
	vote_count: number;

	@IsNumber()
	vote_average: number;
}

export class TmdbSlimMovieDto extends TmdbSlimPictureDto {
	@IsString()
	title: string;

	@IsString()
	original_title: string;

	@IsBoolean()
	adult: boolean;

	@IsString()
	release_date: string;

	@IsBoolean()
	video: boolean;
}

export class TmdbSlimTvDto extends TmdbSlimPictureDto {
	@IsString()
	name: string;

	@IsString()
	original_name: string;

	@IsString()
	first_air_date: string;

	@IsArray()
	@IsString({ each: true })
	origin_country: string[];
}
