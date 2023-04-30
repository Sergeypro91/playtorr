import {
	IsEnum,
	IsArray,
	IsString,
	IsOptional,
	IsDateString,
	ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { MediaType, EnumStatus } from '@app/common/types';
import { IPictureTorrents, ITorrent, ITracker } from '@app/common/interfaces';
import { SearchQueryDataDto } from './parser.dto';

export class DBPictureTorrentsDto implements IPictureTorrents {
	@IsString()
	imdbId: string;

	@IsString()
	tmdbId: string;

	@IsEnum(MediaType)
	mediaType: MediaType;

	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => SearchQueryDataDto)
	searchRequests: SearchQueryDataDto[];
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
