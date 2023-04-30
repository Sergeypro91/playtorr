import { EnumStatus } from '@app/common/types';
import { TrackerDto } from '@app/common/contracts';
import { ISearchQueryData } from '@app/common/interfaces';
import { IsArray, IsEnum, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class SearchQueryDataDto implements ISearchQueryData {
	@IsString()
	searchQuery: string;

	@IsEnum(EnumStatus)
	searchStatus: EnumStatus;

	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => TrackerDto)
	trackers: TrackerDto[];
}
