import {
	IsString,
	IsOptional,
	IsEnum,
	IsArray,
	ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OmitType } from '@nestjs/swagger';
import { PaginationDto } from '@app/common/contracts/base.dto';
import { MediaType, TimeWindow } from '@app/common/types';
import { MovieSlim, TvSlim } from './search';

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

export class PictureTrendsDtoDto extends PaginationDto {
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => MovieSlim || TvSlim)
	results: (MovieSlim | TvSlim)[];
}
