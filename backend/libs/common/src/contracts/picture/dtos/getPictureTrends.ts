import { IsEnum } from 'class-validator';
import { ApiProperty, OmitType, PickType } from '@nestjs/swagger';
import { MediaType, TimeWindow } from '@app/common/types';
import { SearchRequestDto, SearchResultDto } from './search';

export class GetPictureTrendsRequestDto extends PickType(SearchRequestDto, [
	'page',
]) {
	@ApiProperty({ enum: MediaType })
	@IsEnum(MediaType)
	mediaType: MediaType;

	@ApiProperty({ enum: TimeWindow })
	@IsEnum(TimeWindow)
	timeWindow: TimeWindow;
}

export class GetPictureTrendsResponseDto extends SearchResultDto {}

export class GetPictureTrendsParamsDto extends OmitType(
	GetPictureTrendsRequestDto,
	['page'],
) {}

export class GetPictureTrendsQueriesDto extends PickType(SearchRequestDto, [
	'page',
]) {}
