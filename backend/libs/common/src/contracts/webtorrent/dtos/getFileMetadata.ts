import { IsNumber } from 'class-validator';
import { GetTorrentDistributionInfoDto } from './getTorrentDistributionInfoDto';

export class GetFileMetadataDto extends GetTorrentDistributionInfoDto {
	@IsNumber()
	fileId: number;
}
