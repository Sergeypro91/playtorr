import {
	IsArray,
	IsBoolean,
	IsEnum,
	IsNumber,
	IsOptional,
	IsString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { MediaType } from '@app/common/types';
import { SearchRequestDto } from '@app/common/contracts';

export class SearchRequestTmdbDto extends SearchRequestDto {}

export class TmdbSlimMovieDto {
	@IsOptional()
	@IsString()
	poster_path?: string | null;

	@IsBoolean()
	adult: boolean;

	@IsString()
	overview: string;

	@IsString()
	release_date: string;

	@IsString()
	original_title: string;

	@IsNumber({}, { each: true })
	genre_ids: number[];

	@IsNumber()
	id: number;

	@IsEnum(MediaType)
	media_type: MediaType;

	@IsString()
	original_language: string;

	@IsString()
	title: string;

	@IsOptional()
	@IsString()
	backdrop_path?: string | null;

	@IsNumber()
	popularity: number;

	@IsNumber()
	vote_count: number;

	@IsBoolean()
	video: boolean;

	@IsNumber()
	vote_average: number;
}

export class TmdbSlimTvDto {
	@IsOptional()
	@IsString()
	poster_path: string | null;

	@IsNumber()
	popularity: number;

	@IsNumber()
	id: number;

	@IsString()
	overview: string;

	@IsOptional()
	@IsString()
	backdrop_path: string | null;

	@IsNumber()
	vote_average: number;

	@IsEnum(MediaType)
	media_type: MediaType;

	@IsString()
	first_air_date: string;

	@IsArray()
	@IsString({ each: true })
	origin_country: string[];

	@IsArray()
	@IsNumber({}, { each: true })
	genre_ids: number[];

	@IsString()
	original_language: string;

	@IsNumber()
	vote_count: number;

	@IsString()
	name: string;

	@IsString()
	original_name: string;
}

export class TmdbSlimPersonDto {
	@IsOptional()
	@IsString()
	profile_path: string | null;

	@IsBoolean()
	adult: boolean;

	@IsNumber()
	id: number;

	@IsEnum(MediaType)
	media_type: MediaType;

	@IsArray()
	known_for: [object];

	@IsString()
	name: string;

	@IsNumber()
	popularity: number;
}

export class SearchResultTmdbDto {
	@IsNumber()
	page: number;

	@IsArray()
	@Type(() => TmdbSlimMovieDto || TmdbSlimTvDto || TmdbSlimPersonDto)
	results: (TmdbSlimMovieDto | TmdbSlimTvDto | TmdbSlimPersonDto)[];

	@IsNumber()
	totalPages: number;

	@IsNumber()
	totalResults: number;
}
