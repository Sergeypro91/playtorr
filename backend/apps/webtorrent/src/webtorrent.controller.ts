import { RMQRoute, RMQValidate } from 'nestjs-rmq';
import { Body, Controller } from '@nestjs/common';
import { WebtorrentService } from './webtorrent.service';
import { WebtorrentGetTorrentInfo } from '@app/common/contracts';

@Controller()
export class WebtorrentController {
	constructor(private readonly webtorrentService: WebtorrentService) {}

	@RMQValidate()
	@RMQRoute(WebtorrentGetTorrentInfo.topic)
	async getTorrentInfo(
		@Body() dto: WebtorrentGetTorrentInfo.Request,
	): Promise<WebtorrentGetTorrentInfo.Response> {
		return this.webtorrentService.getTorrentInfo(dto);
	}
}
