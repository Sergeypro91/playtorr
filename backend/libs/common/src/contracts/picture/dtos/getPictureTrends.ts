import {
	IsOptional,
	IsEnum,
	IsArray,
	ValidateNested,
	Validate,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OmitType } from '@nestjs/swagger';
import { PaginationDto } from '@app/common/contracts/base.dto';
import { MediaType, TimeWindow } from '@app/common/types';
import { MovieSlim, PersonSlim, SearchResultDto, TvSlim } from './search';
import { IsNumberOrString } from '@app/common/contracts';

export class GetPictureTrendsRequestDto {
	@IsEnum(MediaType)
	mediaType: MediaType;

	@IsEnum(TimeWindow)
	timeWindow: TimeWindow;

	@IsOptional()
	@Validate(IsNumberOrString)
	page?: string | number;
}

export class GetPictureTrendsResponseDto extends SearchResultDto {}

export class GetPictureTrendsApiGatewayDto extends OmitType(
	GetPictureTrendsRequestDto,
	['page'],
) {}
