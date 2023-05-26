import {
	Get,
	Body,
	UseGuards,
	Controller,
	HttpStatus,
	HttpException,
} from '@nestjs/common';
import {
	ApiTags,
	ApiOperation,
	ApiNotFoundResponse,
	ApiUnauthorizedResponse,
	ApiBadRequestResponse,
} from '@nestjs/swagger';
import {
	ErrorDto,
	TorrentInfoDto,
	GetTorrentDistributionInfoDto,
	WebtorrentGetTorrentInfo,
	WebTorrentInfoDto,
	WebTorrentDto,
} from '@app/common/contracts';
import { RMQError, RMQService } from 'nestjs-rmq';
import { AuthenticatedGuard } from '../guards';

@ApiTags('Webtorrent')
@Controller('webtorrent')
export class WebtorrentController {
	constructor(private readonly rmqService: RMQService) {}

	@ApiOperation({ summary: 'Получение информации о торрент файле' })
	@ApiUnauthorizedResponse({ type: ErrorDto })
	@ApiBadRequestResponse({ type: ErrorDto })
	@ApiNotFoundResponse({ type: ErrorDto })
	@UseGuards(AuthenticatedGuard)
	@Get()
	async getTorrentInfo(
		@Body() dto: GetTorrentDistributionInfoDto,
	): Promise<WebTorrentDto> {
		try {
			return await this.rmqService.send<
				WebtorrentGetTorrentInfo.Request,
				WebtorrentGetTorrentInfo.Response
			>(WebtorrentGetTorrentInfo.topic, dto);
		} catch (error) {
			if (error instanceof RMQError) {
				throw new HttpException(
					error.message,
					error.code || HttpStatus.REQUEST_TIMEOUT,
				);
			}
		}
	}
}
