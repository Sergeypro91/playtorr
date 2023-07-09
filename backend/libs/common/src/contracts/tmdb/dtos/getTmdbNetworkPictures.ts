import {
	IsArray,
	IsEnum,
	IsNumber,
	IsOptional,
	Validate,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from '@app/common/contracts/base.dto';
import { MediaType } from '@app/common/types';
import {
	IsNumberOrString,
	TmdbSlimMovieDto,
	TmdbSlimTvDto,
} from '@app/common/contracts';

export class GetTmdbNetworkPicturesRequestDto {
	@ApiProperty({ enum: MediaType })
	@IsEnum(MediaType)
	mediaType: MediaType;

	@IsOptional()
	@Validate(IsNumberOrString)
	page?: string | number;

	@IsNumber()
	network: number;
}

export class GetTmdbNetworkPicturesResponseDto extends PaginationDto {
	@IsArray()
	@Type(() => TmdbSlimMovieDto || TmdbSlimTvDto)
	results: (TmdbSlimMovieDto | TmdbSlimTvDto)[];
}
