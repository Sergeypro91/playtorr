import {
	IsArray,
	IsBoolean,
	IsNumber,
	IsObject,
	IsOptional,
	IsString,
	ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class TmdbGetRequestDto {
	@IsString()
	route: string;

	@IsOptional()
	@IsNumber()
	version?: number;

	@IsOptional()
	@IsArray()
	queries?: string[];
}

export class GetTmdbPersonDataDto {
	@IsString()
	tmdbId: string;
}

export class PersonDetailsDto {
	@IsOptional()
	@IsString()
	birthday: string;

	@IsString()
	known_for_department: string;

	@IsOptional()
	@IsString()
	deathday: string;

	@IsNumber()
	id: number;

	@IsString()
	name: string;

	@IsArray()
	@IsString({ each: true })
	also_known_as: [string];

	@IsNumber()
	gender: number;

	@IsString()
	biography: string;

	@IsNumber()
	popularity: number;

	@IsOptional()
	@IsString()
	place_of_birth: string | null;

	@IsOptional()
	@IsString()
	profile_path: string | null;

	@IsBoolean()
	adult: boolean;

	@IsString()
	imdb_id: string;

	@IsOptional()
	@IsString()
	homepage: null | string;
}

export class TvCastDto {
	@IsString()
	credit_id: string;

	@IsString()
	original_name: string;

	@IsNumber()
	id: number;

	@IsArray()
	@IsNumber()
	genre_ids: [number];

	@IsString()
	character: string;

	@IsString()
	name: string;

	@IsOptional()
	@IsString()
	poster_path: string;

	@IsNumber()
	vote_count: number;

	@IsNumber()
	vote_average: number;

	@IsNumber()
	popularity: number;

	@IsNumber()
	episode_count: number;

	@IsString()
	original_language: string;

	@IsString()
	first_air_date: string;

	@IsOptional()
	@IsString()
	backdrop_path: string;

	@IsString()
	overview: string;

	@IsArray()
	@IsString({ each: true })
	origin_country: [string];
}

export class TvCrewDto {
	@IsNumber()
	id: number;

	@IsString()
	department: string;

	@IsString()
	original_language: string;

	@IsNumber()
	episode_count: number;

	@IsString()
	job: string;

	@IsString()
	overview: string;

	@IsArray()
	@IsString({ each: true })
	origin_country: [string];

	@IsString()
	original_name: string;

	@IsArray()
	@IsNumber()
	genre_ids: [number];

	@IsString()
	name: string;

	@IsString()
	first_air_date: string;

	@IsOptional()
	@IsString()
	backdrop_path: string;

	@IsNumber()
	popularity: number;

	@IsNumber()
	vote_count: number;

	@IsNumber()
	vote_average: number;

	@IsOptional()
	@IsString()
	poster_path: string;

	@IsString()
	credit_id: string;
}

export class MovieCastDto {
	@IsString()
	character: string;

	@IsString()
	credit_id: string;

	@IsString()
	release_date: string;

	@IsNumber()
	vote_count: number;

	@IsBoolean()
	video: boolean;

	@IsBoolean()
	adult: boolean;

	@IsNumber()
	vote_average: number;

	@IsString()
	title: string;

	@IsArray()
	@IsNumber()
	genre_ids: [number];

	@IsString()
	original_language: string;

	@IsString()
	original_title: string;

	@IsNumber()
	popularity: number;

	@IsNumber()
	id: number;

	@IsOptional()
	@IsString()
	backdrop_path: string;

	@IsString()
	overview: string;

	@IsOptional()
	@IsString()
	poster_path: string;
}

export class MovieCrewDto {
	@IsNumber()
	id: number;

	@IsString()
	department: string;

	@IsString()
	original_language: string;

	@IsString()
	original_title: string;

	@IsString()
	job: string;

	@IsString()
	overview: string;

	@IsNumber()
	vote_count: number;

	@IsBoolean()
	video: boolean;

	@IsOptional()
	@IsString()
	poster_path: string;

	@IsOptional()
	@IsString()
	backdrop_path: string;

	@IsString()
	title: string;

	@IsNumber()
	popularity: number;

	@IsArray()
	@IsNumber()
	genre_ids: [number];

	@IsNumber()
	vote_average: number;

	@IsBoolean()
	adult: boolean;

	@IsString()
	release_date: string;

	@IsString()
	credit_id: string;
}

export class PersonMoviesDto {
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => MovieCastDto)
	cast: MovieCastDto[];

	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => MovieCrewDto)
	crew: MovieCrewDto[];
}

export class PersonTvsDto {
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => TvCastDto)
	cast: TvCastDto[];

	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => TvCrewDto)
	crew: TvCrewDto[];
}

export class TmdbPersonDataDto {
	@IsObject()
	@ValidateNested()
	@Type(() => PersonDetailsDto)
	details: PersonDetailsDto;

	@IsObject()
	@ValidateNested()
	@Type(() => PersonMoviesDto)
	movies: PersonMoviesDto;

	@IsObject()
	@ValidateNested()
	@Type(() => PersonTvsDto)
	tvs: PersonTvsDto;
}
