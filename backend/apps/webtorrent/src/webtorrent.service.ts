import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GetTorrentInfo, TorrentInfo } from '@app/common/contracts';

@Injectable()
export class WebtorrentService {
	constructor(private readonly configService: ConfigService) {}

	public async getTorrentInfo({ req }: GetTorrentInfo): Promise<TorrentInfo> {
		return {
			res: `webtorrent return you string ${req}`,
		};
	}
}
