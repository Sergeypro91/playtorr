import {
	Get,
	UseGuards,
	Controller,
	HttpException,
	HttpStatus,
	Param,
	Query,
} from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { Logger as PinoLogger } from 'nestjs-pino/Logger';
import { ApiTags, ApiOperation, ApiNotFoundResponse } from '@nestjs/swagger';
import {
	ErrorDto,
	GetPictureDataDto,
	PictureDetailDataDto,
	SearchPictureDto,
	PicturePageDto,
	GetPictureTrendsDto,
} from '@app/contracts';
import { RMQError, RMQService } from 'nestjs-rmq';
import {
	PictureGetPictureData,
	PictureSearchPicture,
} from '@app/contracts/picture';
import { AuthenticatedGuard } from '../guards';
import { GetPictureTrends } from '@app/contracts/picture/picture.getPictureTrends';

@ApiTags('Picture')
@Controller('picture')
export class PictureController {
	constructor(
		private readonly rmqService: RMQService,
		private readonly pinoLogger: PinoLogger,
	) {}

	@ApiOperation({ summary: 'Получение даных о фильме/сериале' })
	@ApiNotFoundResponse({ type: ErrorDto })
	@UseGuards(AuthenticatedGuard)
	@Get(':tmdbId/:mediaType')
	async getPictureData(
		@Param() query: GetPictureDataDto,
	): Promise<PictureDetailDataDto> {
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

	@ApiOperation({ summary: 'Поиск фильма/сериала по запросу' })
	@ApiNotFoundResponse({ type: ErrorDto })
	@UseGuards(AuthenticatedGuard)
	@Get()
	async searchPicture(
		@Query() query: SearchPictureDto,
	): Promise<PicturePageDto> {
		this.pinoLogger.log(`searchPicture_${uuid()}`);
		try {
			return await this.rmqService.send<
				PictureSearchPicture.Request,
				PictureSearchPicture.Response
			>(PictureSearchPicture.topic, query);
		} catch (error) {
			if (error instanceof RMQError) {
				throw new HttpException(
					error.message,
					error.code || HttpStatus.REQUEST_TIMEOUT,
				);
			}
		}
	}

	@ApiOperation({ summary: 'Получение трендов фильмов/сериалов' })
	@ApiNotFoundResponse({ type: ErrorDto })
	@UseGuards(AuthenticatedGuard)
	@Get('trends/:mediaType/:timeWindow')
	async getPictureTrends(
		@Param() query: GetPictureTrendsDto,
		@Query('page') page: string,
	): Promise<PicturePageDto> {
		this.pinoLogger.log(`getPictureTrends_${uuid()}`);
		try {
			return await this.rmqService.send<
				GetPictureTrends.Request,
				GetPictureTrends.Response
			>(GetPictureTrends.topic, { ...query, page });
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
