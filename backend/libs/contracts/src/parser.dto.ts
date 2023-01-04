import {
	IsEnum,
	IsArray,
	IsString,
	IsOptional,
	IsDateString,
	ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { EnumStatus, MediaType } from '@app/types';
import {
	IPictureTorrents,
	ISearchQueryData,
	ITorrent,
	ITracker,
} from '@app/interfaces';

export class DBPictureTorrentsDto implements IPictureTorrents {
	@IsString()
	imdbId: string;

	@IsString()
	tmdbId: string;

	@IsString()
	mediaType: MediaType;

	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => SearchQueryDataDto)
	searchRequests: SearchQueryDataDto[];
}

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

export class TrackerDto implements ITracker {
	@IsString()
	trackerLabel: string;

	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => TorrentDto)
	torrents: TorrentDto[];

	@IsEnum(EnumStatus)
	trackerStatus: EnumStatus;

	@IsDateString()
	lastUpdate: string;

	@IsString()
	trackerMessage?: string;
}

export class TorrentDto implements ITorrent {
	@IsString()
	name: string;

	@IsOptional()
	@IsString()
	size?: string;

	@IsOptional()
	@IsString()
	link?: string;

	@IsOptional()
	@IsString()
	seeders?: string;

	@IsOptional()
	@IsString()
	leeches?: string;
}

export class GetTorrentsDto {
	@IsString()
	imdbId: string;

	@IsString()
	tmdbId: string;

	@IsString()
	mediaType: MediaType;

	@IsString()
	searchQuery: string;
}

export class TorrentInfoDto extends SearchQueryDataDto {
	@IsOptional()
	@IsString()
	message?: string;
}
