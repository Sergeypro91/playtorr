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

export class DBPictureTorrentsDto {
	@IsString()
	imdbId: string;

	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => SearchQueryDataDto)
	searchRequests: SearchQueryDataDto[];
}

export class SearchQueryDataDto {
	@IsString()
	searchQuery: string;

	@IsDateString()
	lastUpdate: string;

	@IsEnum(EnumStatus)
	searchStatus: EnumStatus;

	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => TorrentDto)
	torrents: TorrentDto[];
}

export class TorrentDto {
	@IsString()
	torrentLabel: string;

	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => TorrentFileDto)
	torrentFiles: TorrentFileDto[];

	@IsEnum(EnumStatus)
	torrentStatus: EnumStatus;

	@IsString()
	torrentStatusMessage?: string;
}

export class TorrentFileDto {
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
