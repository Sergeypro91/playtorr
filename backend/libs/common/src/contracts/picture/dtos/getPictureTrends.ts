import {
	IsArray,
	IsEnum,
	IsNumber,
	IsOptional,
	ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import {
	ApiExtraModels,
	ApiProperty,
	getSchemaPath,
	IntersectionType,
} from '@nestjs/swagger';
import { MediaType, TimeWindow } from '@app/common/types';
import { PaginationDto } from '@app/common/contracts/base.dto';
import { ApiModelPropertyOptional } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { MovieSlim, PersonSlim, TvSlim } from './search';

export class GetPictureTrendsParamsDto {
	@ApiProperty({ enum: MediaType })
	@IsEnum(MediaType)
	mediaType: MediaType;

	@ApiProperty({ enum: TimeWindow })
	@IsEnum(TimeWindow)
	timeWindow: TimeWindow;
}

export class GetPictureTrendsQueriesDto {
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

export class GetPictureTrendsRequestDto extends IntersectionType(
	GetPictureTrendsQueriesDto,
	GetPictureTrendsParamsDto,
) {}

@ApiExtraModels(MovieSlim, TvSlim, PersonSlim)
export class GetPictureTrendsResponseDto extends PaginationDto {
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