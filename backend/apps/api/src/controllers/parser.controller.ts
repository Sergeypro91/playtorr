import {
	Get,
	Body,
	UseGuards,
	Controller,
	HttpException,
	HttpStatus,
} from '@nestjs/common';
import {
	ApiTags,
	ApiOperation,
	ApiNotFoundResponse,
	ApiUnauthorizedResponse,
	ApiBadRequestResponse,
} from '@nestjs/swagger';
import {
	ParserParseTorrents,
	GetTorrentsDto,
	TorrentInfoDto,
	ErrorDto,
	ParserGetPictureTorrents,
	TrackerDto,
} from '@app/common';
import { RMQError, RMQService } from 'nestjs-rmq';
import { AuthenticatedGuard } from '../guards';

@ApiTags('Parser')
@Controller('parser')
export class ParserController {
	constructor(private readonly rmqService: RMQService) {}

	@ApiOperation({ summary: 'Парсинг торрентов по фильму/сериалу из запроса' })
	@ApiUnauthorizedResponse({ type: ErrorDto })
	@ApiBadRequestResponse({ type: ErrorDto })
	@ApiNotFoundResponse({ type: ErrorDto })
	@UseGuards(AuthenticatedGuard)
	@Get('parse')
	async parseTorrents(
		@Body() query: GetTorrentsDto,
	): Promise<TorrentInfoDto> {
		try {
			return await this.rmqService.send<
				ParserParseTorrents.Request,
				ParserParseTorrents.Response
			>(ParserParseTorrents.topic, query);
		} catch (error) {
			if (error instanceof RMQError) {
				throw new HttpException(
					error.message,
					error.code || HttpStatus.REQUEST_TIMEOUT,
				);
			}
		}
	}

	@ApiOperation({ summary: 'Получение торрент файлов по заданному запросу' })
	@ApiUnauthorizedResponse({ type: ErrorDto })
	@ApiBadRequestResponse({ type: ErrorDto })
	@ApiNotFoundResponse({ type: ErrorDto })
	@UseGuards(AuthenticatedGuard)
	@Get()
	async getPictureTorrents(
		@Body() query: GetTorrentsDto,
	): Promise<TrackerDto[]> {
		try {
			return await this.rmqService.send<
				ParserGetPictureTorrents.Request,
				ParserGetPictureTorrents.Response[]
			>(ParserGetPictureTorrents.topic, query);
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
