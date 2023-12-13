import {
	Get,
	Body,
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
	GetTorrentDistributionInfoRequestDto,
	GetTorrentDistributionInfo,
	GetTorrentDistributionInfoResponseDto,
} from '@app/common/contracts';
import { RMQError, RMQService } from 'nestjs-rmq';

@ApiTags('Webtorrent')
@Controller('webtorrent')
export class WebtorrentController {
	constructor(private readonly rmqService: RMQService) {}

	@ApiOperation({ summary: 'Получение информации о торрент файле' })
	@ApiUnauthorizedResponse({ type: ErrorDto })
	@ApiBadRequestResponse({ type: ErrorDto })
	@ApiNotFoundResponse({ type: ErrorDto })
	@Get()
	async getTorrentInfo(
		@Body() dto: GetTorrentDistributionInfoRequestDto,
	): Promise<GetTorrentDistributionInfoResponseDto> {
		try {
			return await this.rmqService.send<
				GetTorrentDistributionInfo.Request,
				GetTorrentDistributionInfo.Response
			>(GetTorrentDistributionInfo.topic, dto);
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
