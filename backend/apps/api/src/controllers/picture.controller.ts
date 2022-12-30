import {
	Get,
	Body,
	UseGuards,
	Controller,
	HttpException,
	HttpStatus,
} from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { Logger as PinoLogger } from 'nestjs-pino/Logger';
import { ApiTags, ApiOperation, ApiNotFoundResponse } from '@nestjs/swagger';
import { GetPictureDataDto, PictureDataDto } from '@app/contracts';
import { RMQError, RMQService } from 'nestjs-rmq';
import { AuthenticatedGuard } from '../guards';
import { PictureGetPictureData } from '@app/contracts/picture';

@ApiTags('Picture')
@Controller('picture')
export class PictureController {
	constructor(
		private readonly rmqService: RMQService,
		private readonly pinoLogger: PinoLogger,
	) {}

	@ApiOperation({ summary: 'Получение даных о фильме/сериале' })
	@ApiNotFoundResponse({ type: GetPictureDataDto })
	@UseGuards(AuthenticatedGuard)
	@Get()
	async getPictureData(
		@Body() query: GetPictureDataDto,
	): Promise<PictureDataDto> {
		this.pinoLogger.log(`getPictureData_${uuid()}`);
		try {
			return await this.rmqService.send<
				PictureGetPictureData.Request,
				PictureGetPictureData.Response
			>(PictureGetPictureData.topic, query);
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
