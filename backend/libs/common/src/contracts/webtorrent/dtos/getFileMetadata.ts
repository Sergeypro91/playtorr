import { IsNumber } from 'class-validator';
import { GetTorrentDistributionInfoRequestDto } from './getTorrentDistributionInfoRequestDto';

export class GetFileMetadataDto extends GetTorrentDistributionInfoRequestDto {
	@IsNumber()
	fileId: number;
}
