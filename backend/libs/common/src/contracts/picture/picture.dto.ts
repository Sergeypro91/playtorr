import {
	IsArray,
	IsString,
	IsOptional,
	ValidateNested,
	IsNumber,
	IsEnum,
} from 'class-validator';
import { IMovieSlim, IPeople, IPersonSlim, ITvSlim } from '@app/common';
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
