import { Type } from 'class-transformer';
import { IsObject } from 'class-validator';
import {
	GetTorrentDistributionInfoDto,
	WebTorrentInfoDto,
} from './getTorrentDistributionInfoDto';

export class UploadTorrentFilesInfoDto extends GetTorrentDistributionInfoDto {
	@IsObject()
	@Type(() => WebTorrentInfoDto)
	torrentInfo: WebTorrentInfoDto;
}
