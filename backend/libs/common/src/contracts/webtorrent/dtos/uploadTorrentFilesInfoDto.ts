import { Type } from 'class-transformer';
import { IsObject } from 'class-validator';
import {
	GetTorrentDistributionInfoRequestDto,
	WebTorrentInfoDto,
} from './getTorrentDistributionInfoRequestDto';

export class UploadTorrentFilesInfoDto extends GetTorrentDistributionInfoRequestDto {
	@IsObject()
	@Type(() => WebTorrentInfoDto)
	torrentInfo: WebTorrentInfoDto;
}
