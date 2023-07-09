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
import { MediaType } from '@app/common/types';
import { PaginationDto } from '@app/common/contracts/base.dto';
import { ApiModelPropertyOptional } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { MovieSlim, TvSlim } from './search';

export class GetNetworkPicturesQueriesDto {
	@ApiModelPropertyOptional({
		required: false,
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

export class GetNetworkPicturesParamsDto {
	@ApiProperty({ enum: MediaType })
	@IsEnum(MediaType)
	mediaType: MediaType;

	@ApiProperty()
	@IsNumber()
	@Transform(({ value }) => {
		return parseInt(value, 10);
	})
	network: number;
}

export class GetNetworkPicturesRequestDto extends IntersectionType(
	GetNetworkPicturesQueriesDto,
	GetNetworkPicturesParamsDto,
) {}

@ApiExtraModels(MovieSlim, TvSlim)
export class GetNetworkPicturesResponseDto extends PaginationDto {
	@ApiProperty({
		type: 'array',
		items: {
			oneOf: [
				{ $ref: getSchemaPath(MovieSlim) },
				{ $ref: getSchemaPath(TvSlim) },
			],
		},
	})
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => MovieSlim || TvSlim)
	results: (MovieSlim | TvSlim)[];
}
