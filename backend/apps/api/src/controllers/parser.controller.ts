import {
	Post,
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
	ParserParsePictureTorrents,
	ParsePictureTorrentsRequestDto,
	ParsePictureTorrentsResponseDto,
	ErrorDto,
	ParserGetPictureTorrents,
	GetTorrentsRequestDto,
	GetTorrentsResponseDto,
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
	@Post('parse')
	async parsePictureTorrents(
		@Body() query: ParsePictureTorrentsRequestDto,
	): Promise<ParsePictureTorrentsResponseDto> {
		try {
			return await this.rmqService.send<
				ParserParsePictureTorrents.Request,
				ParserParsePictureTorrents.Response
			>(ParserParsePictureTorrents.topic, query);
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
	@Post()
	async getPictureTorrents(
		@Body() query: GetTorrentsRequestDto,
	): Promise<GetTorrentsResponseDto[]> {
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
