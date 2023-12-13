import { RMQError, RMQService } from 'nestjs-rmq';
import {
	Get,
	Controller,
	HttpException,
	HttpStatus,
	Logger,
	Param,
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
	GetPersonDataDto,
	PersonDetailDataDto,
	PersonGetPersonData,
} from '@app/common';

@ApiTags('Person')
@Controller('person')
export class PersonController {
	logger = new Logger(PersonController.name);

	constructor(private readonly rmqService: RMQService) {}

	@ApiOperation({ summary: 'Получение данных по Личности' })
	@ApiUnauthorizedResponse({ type: ErrorDto })
	@ApiBadRequestResponse({ type: ErrorDto })
	@ApiNotFoundResponse({ type: ErrorDto })
	@Get(':tmdbId')
	async getPersonData(
		@Param() param: GetPersonDataDto,
	): Promise<PersonDetailDataDto> {
		try {
			return await this.rmqService.send<
				PersonGetPersonData.Request,
				PersonGetPersonData.Response
			>(PersonGetPersonData.topic, param);
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
