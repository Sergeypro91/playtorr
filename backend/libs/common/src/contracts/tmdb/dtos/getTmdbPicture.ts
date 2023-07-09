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
import { GetPictureRequestDto } from '@app/common/contracts';

export class GetTmdbPicture extends GetPictureRequestDto {}

export class TmdbExternalsIdsDto {
	@IsOptional()
	@IsString()
	imdb_id: string | null;

	@IsOptional()
	@IsString()
	freebase_mid: string | null;

	@IsOptional()
	@IsString()
	freebase_id: string | null;

	@IsOptional()
	@IsNumber()
	tvdb_id: number | null;

	@IsOptional()
	@IsNumber()
	tvrage_id: number | null;

	@IsOptional()
	@IsString()
	wikidata_id: string | null;

	@IsOptional()
	@IsString()
	facebook_id: string | null;

	@IsOptional()
	@IsString()
	instagram_id: string | null;

	@IsOptional()
	@IsString()
	twitter_id: string | null;
}

export class TmdbBelongsToCollection {
	@IsNumber()
	id: number;

	@IsString()
	name: string;

	@IsString()
	poster_path: string;

	@IsString()
	backdrop_path: string;
}

export class TmdbGenres {
	@IsNumber()
	id: number;

	@IsString()
	name: string;
}

export class TmdbProductionCompanies {
	@IsNumber()
	id: number;

	@IsString()
	name: string;

	@IsOptional()
	@IsString()
	logo_path: string | null;

	@IsString()
	origin_country: string;
}

export class TmdbProductionCountries {
	@IsString()
	iso_3166_1: string;

	@IsString()
	name: string;
}

export class TmdbSpokenLanguages {
	@IsString()
	iso_639_1: string;

	@IsString()
	name: string;
}

export class VideoResultsObjDto {
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => TmdbVideoDto)
	results: TmdbVideoDto[];
}

export class TmdbVideoDto {
	@IsOptional()
	@IsString()
	iso_639_1?: string;

	@IsOptional()
	@IsString()
	iso_3166_1?: string;

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
	id: string;
}

export class TmdbCastPerson {
	@IsBoolean()
	adult: boolean;

	@IsOptional()
	@IsNumber()
	gender: number | null;

	@IsNumber()
	id: number;

	@IsString()
	known_for_department: string;

	@IsString()
	name: string;

	@IsString()
	original_name: string;

	@IsNumber()
	popularity: number;

	@IsOptional()
	@IsString()
	profile_path: string | null;

	@IsNumber()
	cast_id: number;

	@IsString()
	character: string;

	@IsString()
	credit_id: string;

	@IsNumber()
	order: number;
}

export class TmdbCrewPerson {
	@IsBoolean()
	adult: boolean;

	@IsOptional()
	@IsNumber()
	gender: number | null;

	@IsNumber()
	id: number;

	@IsString()
	known_for_department: string;

	@IsString()
	name: string;

	@IsString()
	original_name: string;

	@IsNumber()
	popularity: number;

	@IsOptional()
	@IsString()
	profile_path: string | null;

	@IsString()
	credit_id: string;

	@IsString()
	department: string;

	@IsString()
	job: string;
}

export class TmdbCreditsDto {
	@IsArray()
	@Type(() => TmdbCastPerson)
	cast: TmdbCastPerson[];

	@IsArray()
	@Type(() => TmdbCrewPerson)
	crew: TmdbCrewPerson[];
}

export class TmdbImageDto {
	@IsNumber()
	aspect_ratio: number;

	@IsString()
	file_path: string;

	@IsNumber()
	height: number;

	@IsOptional()
	@IsString()
	iso_639_1: string | null;

	@IsNumber()
	vote_average: number;

	@IsNumber()
	vote_count: number;

	@IsNumber()
	width: number;
}

export class TmdbImagesDto {
	@IsArray()
	@Type(() => TmdbImageDto)
	backdrops: TmdbImageDto[];

	@IsArray()
	@Type(() => TmdbImageDto)
	logos: TmdbImageDto[];

	@IsArray()
	@Type(() => TmdbImageDto)
	posters: TmdbImageDto[];
}

export class TmdbMovieDto extends TmdbExternalsIdsDto {
	@IsBoolean()
	adult: boolean;

	@IsOptional()
	@IsString()
	backdrop_path: string | null;

	@IsOptional()
	@ValidateNested()
	@Type(() => TmdbBelongsToCollection)
	belongs_to_collection: TmdbBelongsToCollection | null;

	@IsNumber()
	budget: number;

	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => TmdbGenres)
	genres: TmdbGenres[];

	@IsOptional()
	@IsString()
	homepage: string | null;

	@IsString()
	original_language: string;

	@IsString()
	original_title: string;

	@IsOptional()
	@IsString()
	overview: string | null;

	@IsNumber()
	popularity: number;

	@IsOptional()
	@IsString()
	poster_path: string | null;

	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => TmdbProductionCompanies)
	production_companies: TmdbProductionCompanies[];

	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => TmdbProductionCountries)
	production_countries: TmdbProductionCountries[];

	@IsDateString()
	release_date: string;

	@IsNumber()
	revenue: number;

	@IsOptional()
	@IsNumber()
	runtime: number | null;

	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => TmdbSpokenLanguages)
	spoken_languages: TmdbSpokenLanguages[];

	@IsEnum(PictureStatus)
	status: PictureStatus;

	@IsOptional()
	@IsString()
	tagline: string | null;

	@IsString()
	title: string;

	@IsBoolean()
	video: boolean;

	@IsNumber()
	vote_average: number;

	@IsNumber()
	vote_count: number;

	@IsObject()
	@Type(() => VideoResultsObjDto)
	videos: VideoResultsObjDto;

	@IsObject()
	@ValidateNested()
	@Type(() => TmdbCreditsDto)
	credits: TmdbCreditsDto;

	@IsObject()
	@ValidateNested()
	@Type(() => TmdbImagesDto)
	images: TmdbImagesDto;
}

// TV

class TmdbCreatedBy {
	@IsNumber()
	id: number;

	@IsString()
	credit_id: string;

	@IsString()
	name: string;

	@IsNumber()
	gender: number;

	@IsOptional()
	@IsString()
	profile_path: string | null;
}

class TmdbLastEpisodeToAir {
	@IsString()
	air_date: string;

	@IsNumber()
	episode_number: number;

	@IsNumber()
	id: number;

	@IsString()
	name: string;

	@IsString()
	overview: string;

	@IsString()
	production_code: string;

	@IsNumber()
	season_number: number;

	@IsOptional()
	@IsString()
	still_path: string | null;

	@IsNumber()
	vote_average: number;

	@IsNumber()
	vote_count: number;
}

class TmdbNextEpisodeToAir {
	@IsString()
	air_date: string;

	@IsNumber()
	episode_number: number;

	@IsNumber()
	id: number;

	@IsString()
	name: string;

	@IsString()
	overview: string;

	@IsString()
	production_code: string;

	@IsNumber()
	season_number: number;

	@IsOptional()
	@IsString()
	still_path: string | null;

	@IsNumber()
	vote_average: number;

	@IsNumber()
	vote_count: number;
}

class TmdbNetworks {
	@IsString()
	name: string;

	@IsNumber()
	id: number;

	@IsOptional()
	@IsString()
	logo_path: string | null;

	@IsString()
	origin_country: string;
}

class TmdbSeasons {
	@IsString()
	air_date: string;

	@IsNumber()
	episode_count: number;

	@IsNumber()
	id: number;

	@IsString()
	name: string;

	@IsString()
	overview: string;

	@IsOptional()
	@IsString()
	poster_path: string | null;

	@IsNumber()
	season_number: number;
}

export class TmdbTvDto extends TmdbExternalsIdsDto {
	@IsOptional()
	@IsString()
	backdrop_path: string | null;

	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => TmdbCreatedBy)
	created_by: TmdbCreatedBy[];

	@IsArray()
	@IsNumber()
	episode_run_time: number[];

	@IsDateString()
	first_air_date: string;

	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => TmdbGenres)
	genres: TmdbGenres[];

	@IsOptional()
	@IsString()
	homepage: string | null;

	@IsBoolean()
	in_production: boolean;

	@IsString()
	last_air_date: string;

	@IsObject()
	@Type(() => TmdbLastEpisodeToAir)
	last_episode_to_air: TmdbLastEpisodeToAir;

	@IsString()
	name: string;

	@IsOptional()
	@IsObject()
	@Type(() => TmdbNextEpisodeToAir)
	next_episode_to_air: null | TmdbNextEpisodeToAir;

	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => TmdbNetworks)
	networks: TmdbNetworks[];

	@IsNumber()
	number_of_episodes: number;

	@IsNumber()
	number_of_seasons: number;

	@IsArray()
	@IsString()
	origin_country: string[];

	@IsString()
	original_language: string;

	@IsString()
	original_name: string;

	@IsOptional()
	@IsString()
	overview: string | null;

	@IsNumber()
	popularity: number;

	@IsOptional()
	@IsString()
	poster_path: string | null;

	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => TmdbProductionCompanies)
	production_companies: TmdbProductionCompanies[];

	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => TmdbProductionCountries)
	production_countries: TmdbProductionCountries[];

	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => TmdbSeasons)
	seasons: TmdbSeasons[];

	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => TmdbSpokenLanguages)
	spoken_languages: TmdbSpokenLanguages[];

	@IsString()
	status: string;

	@IsOptional()
	@IsString()
	tagline: string | null;

	@IsString()
	type: string;

	@IsNumber()
	vote_average: number;

	@IsNumber()
	vote_count: number;

	@IsObject()
	@Type(() => VideoResultsObjDto)
	videos: VideoResultsObjDto;

	@IsObject()
	@ValidateNested()
	@Type(() => TmdbCreditsDto)
	credits: TmdbCreditsDto;

	@IsObject()
	@ValidateNested()
	@Type(() => TmdbImagesDto)
	images: TmdbImagesDto;
}
