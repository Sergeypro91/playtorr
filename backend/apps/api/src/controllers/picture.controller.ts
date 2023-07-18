import { RMQError, RMQService } from 'nestjs-rmq';
import {
	Get,
	Param,
	Query,
	Logger,
	Session,
	UseGuards,
	Controller,
	HttpStatus,
	HttpException,
} from '@nestjs/common';
import {
	ApiTags,
	ApiOperation,
	ApiNotFoundResponse,
	ApiBadRequestResponse,
	ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
	GetPicture,
	PictureSearch,
	GetPictureTrends,
	GetNetworkPictures,
	UserPushUserRecentView,
	PictureGetRecentViewedPictures,
	ErrorDto,
	SearchResultDto,
	SearchRequestDto,
	GetPictureParams,
	GetPictureQueries,
	GetPictureResponseDto,
	GetPictureTrendsParamsDto,
	GetPictureTrendsQueriesDto,
	GetNetworkPicturesParamsDto,
	GetPictureTrendsResponseDto,
	GetNetworkPicturesQueriesDto,
	GetNetworkPicturesResponseDto,
} from '@app/common/contracts';
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
	// @UseGuards(AuthenticatedGuard)
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
	// @UseGuards(AuthenticatedGuard)
	@Get(':tmdbId/:mediaType')
	async getPictureData(
		@Param() param: GetPictureParams,
		@Query() query: GetPictureQueries,
		@Session() { passport }: Record<string, any>,
	): Promise<GetPictureResponseDto> {
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
				GetPicture.Request,
				GetPicture.Response
			>(GetPicture.topic, { ...param, ...query });
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
	// @UseGuards(AuthenticatedGuard)
	@Get('trends/:mediaType/:timeWindow')
	async getPictureTrends(
		@Param() param: GetPictureTrendsParamsDto,
		@Query() query: GetPictureTrendsQueriesDto,
	): Promise<GetPictureTrendsResponseDto> {
		try {
			return await this.rmqService.send<
				GetPictureTrends.Request,
				GetPictureTrends.Response
			>(GetPictureTrends.topic, { ...param, ...query });
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
		summary: 'Получение фильмов/сериалов определенной компании',
	})
	@ApiUnauthorizedResponse({ type: ErrorDto })
	@ApiBadRequestResponse({ type: ErrorDto })
	@ApiNotFoundResponse({ type: ErrorDto })
	// @UseGuards(AuthenticatedGuard)
	@Get('network/:mediaType/:network')
	async getNetworkPictures(
		@Param() param: GetNetworkPicturesParamsDto,
		@Query() query: GetNetworkPicturesQueriesDto,
	): Promise<GetNetworkPicturesResponseDto> {
		try {
			return await this.rmqService.send<
				GetNetworkPictures.Request,
				GetNetworkPictures.Response
			>(GetNetworkPictures.topic, { ...param, ...query });
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
	): Promise<GetPictureResponseDto[]> {
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
