import {
	IsEnum,
	IsArray,
	IsString,
	IsOptional,
	IsDateString,
	ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { SearchStatus } from '@app/interfaces';

export class DBPictureTorrentsDto {
	@IsString()
	imdbId: string;

	@IsDateString()
	searchRequests: SearchQueryDto[];
}

export class SearchQueryDto {
	@IsString()
	searchQuery: string;

	@IsDateString()
	lastUpdate: string;

	@IsEnum(SearchStatus)
	searchStatus: SearchStatus;

	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => TorrentFileDto)
	torrentFiles: TorrentFileDto[];
}

export class GetTorrentsDto {
	@IsString()
	imdbId: string;

	@IsString()
	searchQuery: string;
}

export class TorrentFileDto {
	@IsString()
	torrentLabel: string;

	@IsString()
	name: string;

	@IsOptional()
	@IsString()
	size?: string;

	@IsOptional()
	@IsString()
	magnet?: string;

	@IsOptional()
	@IsString()
	seeders?: string;

	@IsOptional()
	@IsString()
	leechers?: string;
}
