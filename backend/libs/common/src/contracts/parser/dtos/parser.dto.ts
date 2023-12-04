import { EnumStatus } from '@app/common/types';
import { GetTorrentsResponseDto } from '@app/common/contracts';
import { ISearchQueryData } from '@app/common/interfaces';
import { IsArray, IsEnum, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class SearchQueryDataDto implements ISearchQueryData {
	@ApiProperty()
	@IsString()
	searchQuery: string;

	@ApiProperty({ enum: EnumStatus })
	@IsEnum(EnumStatus)
	searchStatus: EnumStatus;

	@ApiProperty({ type: [GetTorrentsResponseDto] })
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => GetTorrentsResponseDto)
	trackers: GetTorrentsResponseDto[];
}
