import { IsString } from 'class-validator';

export class GetTorrentInfo {
	@IsString()
	req: string;
}

export class TorrentInfo {
	@IsString()
	res: string;
}
