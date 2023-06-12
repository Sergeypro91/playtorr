import {
	IsArray,
	IsBoolean,
	IsEnum,
	IsNumber,
	IsOptional,
	IsString,
	Validate,
} from 'class-validator';
import { Type } from 'class-transformer';
import { MediaType } from '@app/common/types';
import { PaginationDto } from '@app/common/contracts/base.dto';
import { TmdbSlimMovieDto, TmdbSlimTvDto } from './getTmdbPictureTrends';
import { IsNumberOrString } from '@app/common/contracts';

export class SearchRequestTmdbDto {
	@IsString()
	query: string;

	@IsOptional()
	@Validate(IsNumberOrString)
	page?: string | number;
}

export class TmdbSlimMovieWithMediaTypeDto extends TmdbSlimMovieDto {
	@IsEnum(MediaType)
	media_type: MediaType;
}

export class TmdbSlimTvWithMediaTypeDto extends TmdbSlimTvDto {
	@IsEnum(MediaType)
	media_type: MediaType;
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

export class SearchResultTmdbDto extends PaginationDto {
	@IsArray()
	@Type(
		() =>
			TmdbSlimMovieWithMediaTypeDto ||
			TmdbSlimTvWithMediaTypeDto ||
			TmdbSlimPersonDto,
	)
	results: (
		| TmdbSlimMovieWithMediaTypeDto
		| TmdbSlimTvWithMediaTypeDto
		| TmdbSlimPersonDto
	)[];
}
