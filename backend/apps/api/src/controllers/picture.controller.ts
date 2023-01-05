import { v4 as uuid } from 'uuid';
import { RMQError, RMQService } from 'nestjs-rmq';
import {
	Get,
	Param,
	Query,
	Session,
	UseGuards,
	Controller,
	HttpException,
	HttpStatus,
	Logger,
} from '@nestjs/common';
import { Logger as PinoLogger } from 'nestjs-pino/Logger';
import {
	ApiTags,
	ApiOperation,
	ApiNotFoundResponse,
	ApiUnauthorizedResponse,
	ApiBadRequestResponse,
} from '@nestjs/swagger';
import {
	ErrorDto,
	PicturePageDto,
	SearchPictureDto,
	GetPictureDataDto,
	GetPictureTrendsDto,
	PictureDetailDataDto,
	UserPushUserRecentView,
	PictureGetPictureData,
	PictureSearchPicture,
	GetPictureTrends,
	PictureGetRecentViewedPictures,
	PictureDataDto,
} from '@app/contracts';
import { AuthenticatedGuard } from '../guards';

@ApiTags('Picture')
@Controller('picture')
export class PictureController {
	logger = new Logger(PictureController.name);

	constructor(
		private readonly rmqService: RMQService,
		private readonly pinoLogger: PinoLogger,
	) {}

	@ApiOperation({ summary: 'Поиск фильма/сериала по запросу' })
	@ApiUnauthorizedResponse({ type: ErrorDto })
	@ApiBadRequestResponse({ type: ErrorDto })
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

	@ApiOperation({ summary: 'Получение даных о фильме/сериале' })
	@ApiUnauthorizedResponse({ type: ErrorDto })
	@ApiBadRequestResponse({ type: ErrorDto })
	@ApiNotFoundResponse({ type: ErrorDto })
	@UseGuards(AuthenticatedGuard)
	@Get(':tmdbId/:mediaType')
	async getPictureData(
		@Param() query: GetPictureDataDto,
		@Session() { passport }: Record<string, any>,
	): Promise<PictureDetailDataDto> {
		this.pinoLogger.log(`getPictureData_${uuid()}`);

		// Save "Picture" IDs to user entity -> recentViews
		try {
			await this.rmqService.send<
				UserPushUserRecentView.Request,
				UserPushUserRecentView.Response
			>(UserPushUserRecentView.topic, {
				...query,
				email: passport.user.email,
			});
		} catch (error) {
			this.logger.error(error);
		}

		// "Picture" request itself
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

	@ApiOperation({ summary: 'Получение трендов фильмов/сериалов' })
	@ApiUnauthorizedResponse({ type: ErrorDto })
	@ApiBadRequestResponse({ type: ErrorDto })
	@ApiNotFoundResponse({ type: ErrorDto })
	@UseGuards(AuthenticatedGuard)
	@Get('trends/:mediaType/:timeWindow')
	async getPictureTrends(
		@Param() query: Omit<GetPictureTrendsDto, 'page'>,
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

	@ApiOperation({
		summary: 'Получение перечня недавно просматриваемых фильмов/сериалов',
	})
	@ApiUnauthorizedResponse({ type: ErrorDto })
	@ApiBadRequestResponse({ type: ErrorDto })
	@ApiNotFoundResponse({ type: ErrorDto })
	@UseGuards(AuthenticatedGuard)
	@Get('recent-viewed')
	async getRecentViewedPictures(
		@Session() { passport }: Record<string, any>,
	): Promise<PictureDataDto[]> {
		this.pinoLogger.log(`getPicturesData_${uuid()}`);

		try {
			return await this.rmqService.send<
				PictureGetRecentViewedPictures.Request[],
				PictureGetRecentViewedPictures.Response[]
			>(PictureGetRecentViewedPictures.topic, passport.user.email);
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
