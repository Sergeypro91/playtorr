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
import {
	ApiTags,
	ApiOperation,
	ApiNotFoundResponse,
	ApiUnauthorizedResponse,
	ApiBadRequestResponse,
} from '@nestjs/swagger';
import {
	ErrorDto,
	SearchResultDto,
	SearchRequestDto,
	UserPushUserRecentView,
	PictureGetPicture,
	PictureSearch,
	GetPictureTrends,
	PictureGetRecentViewedPictures,
	PictureDto,
	GetPictureTrendsApiGatewayDto,
} from '@app/common';
import { GetPictureDto } from '@app/common/contracts';
import { AuthenticatedGuard } from '../guards';

@ApiTags('Picture')
@Controller('picture')
export class PictureController {
	logger = new Logger(PictureController.name);

	constructor(private readonly rmqService: RMQService) {}

	@ApiOperation({ summary: 'Поиск фильма/сериала по запросу' })
	@ApiUnauthorizedResponse({ type: ErrorDto })
	@ApiBadRequestResponse({ type: ErrorDto })
	@ApiNotFoundResponse({ type: ErrorDto })
	@UseGuards(AuthenticatedGuard)
	@Get()
	async search(@Query() query: SearchRequestDto): Promise<SearchResultDto> {
		try {
			return await this.rmqService.send<
				PictureSearch.Request,
				PictureSearch.Response
			>(PictureSearch.topic, query);
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
		@Param() param: GetPictureDto,
		@Session() { passport }: Record<string, any>,
	): Promise<PictureDto> {
		// Save "Picture" IDs to user entity -> recentViews
		try {
			await this.rmqService.send<
				UserPushUserRecentView.Request,
				UserPushUserRecentView.Response
			>(UserPushUserRecentView.topic, {
				...param,
				email: passport.user.email,
			});
		} catch (error) {
			this.logger.error(error);
		}

		// "Picture" request itself
		try {
			return await this.rmqService.send<
				PictureGetPicture.Request,
				PictureGetPicture.Response
			>(PictureGetPicture.topic, param);
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
		@Param() param: GetPictureTrendsApiGatewayDto,
		@Query('page') page?: string,
	): Promise<SearchResultDto> {
		try {
			return await this.rmqService.send<
				GetPictureTrends.Request,
				GetPictureTrends.Response
			>(GetPictureTrends.topic, { ...param, page });
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
	): Promise<PictureDto[]> {
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
