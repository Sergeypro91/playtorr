import { RMQService } from 'nestjs-rmq';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
	UserGetUser,
	TmdbSearchTmdb,
	TmdbGetTmdbPicture,
	TmdbGetTmdbPictureTrends,
	GetPictureParams,
	PictureDto,
	SearchResultDto,
	SearchRequestDto,
	GetPictureTrendsRequestDto,
	GetPictureTrendsResponseDto,
} from '@app/common/contracts';
import { daysPassed, ttlToDay } from '@app/common/utils';
import { ApiError } from '@app/common/constants';
import {
	adaptSearchResult,
	adaptPicture,
	adaptPictureTrendsResult,
} from './utils';
import { PictureRepository } from './repositories/picture.repository';
import { TrendRepository } from './repositories/trend.repository';
import { MediaType } from '@app/common';

@Injectable()
export class PictureService {
	public movieTtl: number;
	public tvTtl: number;
	public trendsTtl: number;

	constructor(
		private readonly rmqService: RMQService,
		private readonly configService: ConfigService,
		private readonly pictureRepository: PictureRepository,
		private readonly trendRepository: TrendRepository,
	) {
		this.movieTtl = parseInt(configService.get('MOVIE_TTL', '2592000'), 10);
		this.tvTtl = parseInt(configService.get('TV_TTL', '604800'), 10);
		this.trendsTtl = parseInt(configService.get('TRENDS_TTL', '86400'), 10);
	}

	public async search(dto: SearchRequestDto): Promise<SearchResultDto> {
		const searchResult = await this.rmqService.send<
			TmdbSearchTmdb.Request,
			TmdbSearchTmdb.Response
		>(TmdbSearchTmdb.topic, dto);

		return {
			...searchResult,
			results: searchResult.results.map((searchResult) =>
				adaptSearchResult(searchResult),
			),
		};
	}

	public async getPicture(dto: GetPictureParams): Promise<PictureDto> {
		try {
			let picture = await this.pictureRepository.findPictureByTmdbId(dto);

			const getTmdbPicture = async () => {
				const pictureData = await this.rmqService.send<
					TmdbGetTmdbPicture.Request,
					| TmdbGetTmdbPicture.ResponseMovie
					| TmdbGetTmdbPicture.ResponseTv
				>(TmdbGetTmdbPicture.topic, dto);

				return adaptPicture({
					pictureData,
					mediaType: dto.mediaType,
				});
			};

			if (!picture) {
				picture = await this.pictureRepository.savePicture(
					await getTmdbPicture(),
				);
			} else {
				const lastUpdateDayPassed = daysPassed({
					to: picture['updatedAt'],
				});
				const ttlInDay = ttlToDay(
					picture.mediaType === MediaType.MOVIE
						? this.movieTtl
						: this.tvTtl,
				);

				if (lastUpdateDayPassed > ttlInDay) {
					picture = await this.pictureRepository.updatePicture(
						await getTmdbPicture(),
					);
				}
			}

			return picture;
		} catch (error) {
			throw new ApiError(error.statusCode, error.message);
		}
	}

	public async getPictureTrends(
		dto: GetPictureTrendsRequestDto,
	): Promise<GetPictureTrendsResponseDto> {
		let trend = await this.trendRepository.findTrendsPage(dto);

		const getTrend = async () => {
			const rawTrendResponse = await this.rmqService.send<
				TmdbGetTmdbPictureTrends.Request,
				TmdbGetTmdbPictureTrends.Response
			>(TmdbGetTmdbPictureTrends.topic, dto);

			return {
				trendRequest: dto,
				trendResponse: {
					page: rawTrendResponse['page'],
					totalPages: rawTrendResponse['total_pages'],
					totalResults: rawTrendResponse['total_results'],
					results: rawTrendResponse.results.map((searchResult) =>
						adaptPictureTrendsResult({
							...searchResult,
						}),
					),
				},
			};
		};

		if (!trend) {
			trend = await this.trendRepository.saveTrends(await getTrend());
		} else {
			const lastUpdateDayPassed = daysPassed({
				to: trend['updatedAt'],
			});
			const ttlInDay = ttlToDay(this.trendsTtl);

			if (lastUpdateDayPassed > ttlInDay) {
				trend = await this.trendRepository.updateTrendsPage(
					await getTrend(),
				);
			}
		}

		return trend.trendResponse;
	}

	public async getRecentViewedPictures(email: string): Promise<PictureDto[]> {
		try {
			const user = await this.rmqService.send<
				UserGetUser.Request,
				UserGetUser.Response[]
			>(UserGetUser.topic, { email });

			return await this.pictureRepository.findPicturesByTmdbId(
				user[0].recentViews,
			);
		} catch (error) {
			throw new ApiError(error.statusCode, error.message);
		}
	}
}
