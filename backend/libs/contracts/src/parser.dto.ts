import { IsString } from 'class-validator';

export class GetTorrentsDto {
	@IsString()
	search: string;
}

export class TorrentDto {
	@IsString()
	torrentLabel: string;

	@IsString()
	name: string;

	@IsString()
	size: string;

	@IsString()
	magnet: string;

	@IsString()
	seeders: string;

	@IsString()
	leechers: string;
}
