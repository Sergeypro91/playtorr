import { Body, Get, Controller, HttpException } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { Logger as PinoLogger } from 'nestjs-pino/Logger';
import { ApiTags, ApiOperation, ApiNotFoundResponse } from '@nestjs/swagger';
import { ParserGetTorrents, TorrentDto, GetTorrentsDto } from '@app/contracts';
import { RMQError, RMQService } from 'nestjs-rmq';

@ApiTags('Parser')
@Controller('parser')
export class ParserController {
	constructor(
		private readonly rmqService: RMQService,
		private readonly pinoLogger: PinoLogger,
	) {}

	@ApiOperation({ summary: 'Получение торрент файлов по заданному запросу' })
	@ApiNotFoundResponse({ type: TorrentDto })
	@Get()
	async getTorrents(@Body() query: GetTorrentsDto): Promise<TorrentDto> {
		this.pinoLogger.log(`getTorrents_${uuid()}`);
		try {
			return await this.rmqService.send<
				ParserGetTorrents.Request,
				ParserGetTorrents.Response
			>(ParserGetTorrents.topic, query);
		} catch (error) {
			if (error instanceof RMQError) {
				throw new HttpException(error.message, error.code);
			}
		}
	}
}
