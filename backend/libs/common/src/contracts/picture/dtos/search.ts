import {
	IsArray,
	IsNumber,
	IsOptional,
	IsString,
	ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { MediaType } from '@app/common/types';
import { PaginationDto } from '@app/common/contracts/base.dto';
import { IMovieSlim, IPersonSlim, ITvSlim } from '@app/common/interfaces';
import { ApiProperty } from '@nestjs/swagger';
import { ApiModelPropertyOptional } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';

export class SearchRequestDto {
	@ApiProperty()
	@IsString()
	query: string;

	@ApiModelPropertyOptional({
		minimum: 1,
		default: 1,
	})
	@IsOptional()
	@IsNumber()
	@Transform(({ value }) => {
		return parseInt(value, 10);
	})
	page?: number;
}

export class MovieSlim implements IMovieSlim {
	@ApiProperty()
	@IsNumber()
	tmdbId: number; // id

	@ApiProperty()
	@IsString()
	mediaType: MediaType.MOVIE; // media_type

	@ApiProperty({ nullable: true })
	@IsOptional()
	@IsString()
	posterPath: string | null; // poster_path

	@ApiProperty({ nullable: true })
	@IsOptional()
	@IsString()
	hPosterPath: string | null;

	@ApiProperty({ type: String, nullable: true })
	@IsOptional()
	@IsString()
	backdropPath: string | null; // backdrop_path

	@ApiProperty()
	@IsString()
	title: string;

	@ApiProperty()
	@IsString()
	originalTitle: string; // original_title

	@ApiProperty({ nullable: true })
	@IsOptional()
	@IsString()
	overview: string | null;

	@ApiProperty({ type: [Number] })
	@IsNumber({}, { each: true })
	genres: number[]; // genre_ids

	@ApiProperty()
	@IsString()
	releaseDate: string; // release_date

	@ApiProperty()
	@IsNumber()
	popularity: number;

	@ApiProperty()
	@IsNumber()
	voteAverage: number; // vote_average
}

export class TvSlim implements ITvSlim {
	@ApiProperty()
	@IsNumber()
	tmdbId: number; // id

	@ApiProperty()
	@IsString()
	mediaType: MediaType.TV; // media_type

	@ApiProperty({ nullable: true })
	@IsOptional()
	@IsString()
	posterPath: string | null; // poster_path

	@ApiProperty({ nullable: true })
	@IsOptional()
	@IsString()
	hPosterPath: string | null;

	@ApiProperty({ type: String, nullable: true })
	@IsOptional()
	@IsString()
	backdropPath: string | null; // backdrop_path

	@ApiProperty()
	@IsString()
	title: string; // name

	@ApiProperty()
	@IsString()
	originalTitle: string; //original_name

	@ApiProperty()
	@IsString()
	overview: string;

	@ApiProperty({ type: [Number] })
	@IsArray()
	@IsNumber({}, { each: true })
	genres: number[]; // genre_ids

	@ApiProperty()
	@IsString()
	releaseDate: string; // first_air_date

	@ApiProperty()
	@IsNumber()
	popularity: number;

	@ApiProperty()
	@IsNumber()
	voteAverage: number; // vote_average
}

export class PersonSlim implements IPersonSlim {
	@ApiProperty()
	@IsNumber()
	tmdbId: number; // id

	@ApiProperty()
	@IsString()
	mediaType: MediaType.PERSON; // media_type

	@ApiProperty()
	@IsString()
	name: string;

	@ApiProperty({ nullable: true })
	@IsOptional()
	@IsString()
	profilePath: string | null; // profile_path

	@ApiProperty()
	@IsNumber()
	popularity: number;
}

export class SearchResultDto extends PaginationDto {
	@ApiProperty({ type: [MovieSlim || TvSlim || PersonSlim] })
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => MovieSlim || TvSlim || PersonSlim)
	results: (MovieSlim | TvSlim | PersonSlim)[];
}
