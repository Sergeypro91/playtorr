import {
	IsArray,
	IsEnum,
	IsNumber,
	IsOptional,
	IsString,
	ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { MediaType } from '@app/common/types';
import { PaginationDto } from '@app/common/contracts/base.dto';
import { IMovieSlim, IPersonSlim, ITvSlim } from '@app/common/interfaces';

export class SearchRequestDto {
	@IsString()
	query: string;

	@IsOptional()
	@IsString()
	page?: string;
}

export class SearchResultDto extends PaginationDto {
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => MovieSlim || TvSlim || PersonSlim)
	results: (MovieSlim | TvSlim | PersonSlim)[];
}

export class MovieSlim implements IMovieSlim {
	@IsOptional()
	@IsString()
	posterPath: string | null; // poster_path

	@IsOptional()
	@IsString()
	hPosterPath: string | null;

	@IsOptional()
	@IsString()
	backdropPath: string | null; // backdrop_path

	@IsString()
	releaseDate: string; // release_date

	@IsString()
	originalTitle: string; // original_title

	@IsNumber({}, { each: true })
	genres: number[]; // genre_ids

	@IsNumber()
	tmdbId: number; // id

	@IsEnum(MediaType)
	mediaType: MediaType.MOVIE; // media_type

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

	@IsOptional()
	@IsString()
	hPosterPath: string | null;

	@IsOptional()
	@IsString()
	backdropPath: string | null; // backdrop_path

	@IsNumber()
	popularity: number;

	@IsNumber()
	tmdbId: number; // id

	@IsString()
	overview: string;

	@IsNumber()
	voteAverage: number; // vote_average

	@IsEnum(MediaType)
	mediaType: MediaType.TV; // media_type

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
	mediaType: MediaType.PERSON; // media_type

	@IsString()
	name: string;

	@IsNumber()
	popularity: number;
}
