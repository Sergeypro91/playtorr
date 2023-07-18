import {
	IsArray,
	IsEnum,
	IsNumber,
	IsOptional,
	IsString,
	ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { MediaType } from '@app/common/types';
import { PaginationDto } from '@app/common/contracts/base.dto';
import { IMovieSlim, IPersonSlim, ITvSlim } from '@app/common/interfaces';
import { ApiExtraModels, ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { ApiModelPropertyOptional } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';

export class SearchRequestDto {
	@ApiProperty()
	@IsString()
	query: string;

	@ApiProperty({ enum: MediaType })
	@IsEnum(MediaType)
	mediaType: MediaType;

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
	@IsString()
	tmdbId: string; // id

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

	@ApiProperty({ nullable: true })
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

	@ApiProperty({ nullable: true })
	@IsOptional()
	@IsString()
	trailer: string;
}

export class TvSlim implements ITvSlim {
	@ApiProperty()
	@IsString()
	tmdbId: string; // id

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

	@ApiProperty({ nullable: true })
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

	@ApiProperty({ nullable: true })
	@IsOptional()
	@IsString()
	trailer: string;
}

export class PersonSlim implements IPersonSlim {
	@ApiProperty()
	@IsString()
	tmdbId: string; // id

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

@ApiExtraModels(MovieSlim, TvSlim, PersonSlim)
export class SearchResultDto extends PaginationDto {
	@ApiProperty({
		type: 'array',
		items: {
			oneOf: [
				{ $ref: getSchemaPath(MovieSlim) },
				{ $ref: getSchemaPath(TvSlim) },
				{ $ref: getSchemaPath(PersonSlim) },
			],
		},
	})
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => MovieSlim || TvSlim || PersonSlim)
	results: (MovieSlim | TvSlim | PersonSlim)[];
}
