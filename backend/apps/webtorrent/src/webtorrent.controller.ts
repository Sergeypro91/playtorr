import { RMQRoute, RMQValidate } from 'nestjs-rmq';
import { Body, Controller } from '@nestjs/common';
import { WebtorrentService } from './webtorrent.service';
import { GetTorrentDistributionInfo } from '@app/common/contracts';

@Controller()
export class WebtorrentController {
	constructor(private readonly webtorrentService: WebtorrentService) {}

	@RMQValidate()
	@RMQRoute(GetTorrentDistributionInfo.topic)
	async getTorrentInfo(
		@Body() dto: GetTorrentDistributionInfo.Request,
	): Promise<GetTorrentDistributionInfo.Response> {
		return this.webtorrentService.getTorrentInfo(dto);
	}
}
