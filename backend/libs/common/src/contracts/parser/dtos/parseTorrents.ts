import { IsOptional, IsString } from 'class-validator';
import { MediaType } from '@app/common/types';
import { SearchQueryDataDto } from './parser.dto';

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
