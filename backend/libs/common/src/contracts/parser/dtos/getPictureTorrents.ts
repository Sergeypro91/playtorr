import {
	IsEnum,
	IsArray,
	IsString,
	IsOptional,
	IsDateString,
	ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { MediaType, EnumStatus } from '@app/common/types';
import { IPictureTorrents, ITorrent, ITracker } from '@app/common/interfaces';
import { SearchQueryDataDto } from './parser.dto';
import { ParsePictureTorrentsRequestDto } from './parsePictureTorrents';

export class DBPictureTorrentsDto implements IPictureTorrents {
	@ApiProperty()
	@IsString()
	imdbId: string;

	@ApiProperty()
	@IsString()
	tmdbId: string;

	@ApiProperty({ enum: MediaType })
	@IsEnum(MediaType)
	mediaType: MediaType;

	@ApiProperty({ type: [SearchQueryDataDto] })
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => SearchQueryDataDto)
	searchRequests: SearchQueryDataDto[];
}

export class TorrentDto implements ITorrent {
	@ApiProperty()
	@IsString()
	name: string;

	@ApiProperty({ nullable: true })
	@IsOptional()
	@IsString()
	size?: string;

	@ApiProperty({ nullable: true })
	@IsOptional()
	@IsString()
	link?: string;

	@ApiProperty({ nullable: true })
	@IsOptional()
	@IsString()
	seeders?: string;

	@ApiProperty({ nullable: true })
	@IsOptional()
	@IsString()
	leeches?: string;
}

export class GetTorrentsRequestDto extends ParsePictureTorrentsRequestDto {}

export class GetTorrentsResponseDto implements ITracker {
	@ApiProperty()
	@IsString()
	trackerLabel: string;

	@ApiProperty({ type: [TorrentDto] })
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => TorrentDto)
	torrents: TorrentDto[];

	@ApiProperty({ enum: EnumStatus })
	@IsEnum(EnumStatus)
	trackerStatus: EnumStatus;

	@ApiProperty()
	@IsDateString()
	lastUpdate: string;

	@ApiProperty({ nullable: true })
	@IsOptional()
	@IsString()
	trackerMessage?: string;
}
