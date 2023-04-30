import { Type } from 'class-transformer';
import { IsObject } from 'class-validator';
import {
	GetTorrentDistributionInfoDto,
	TorrentDistributionInfoDto,
} from './getTorrentDistributionInfoDto';

export class UploadTorrentFilesInfoDto extends GetTorrentDistributionInfoDto {
	@IsObject()
	@Type(() => TorrentDistributionInfoDto)
	torrentData: TorrentDistributionInfoDto;
}
