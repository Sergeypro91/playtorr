import { RMQService } from 'nestjs-rmq';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
	UsersFindUserByEmail,
	GetTmdbSearch,
	GetTmdbPicture,
	GetTmdbPictureTrends,
	TmdbGetTmdbNetworkPictures,
	GetPictureParams,
	GetPictureResponseDto,
	SearchResultDto,
	SearchRequestDto,
	GetPictureTrendsRequestDto,
	GetPictureTrendsResponseDto,
	GetNetworkPicturesRequestDto,
	GetNetworkPicturesResponseDto,
} from '@app/common/contracts';
import { MediaType } from '@app/common/types';
import { daysPassed, ttlToDay } from '@app/common/utils';
import { ApiError } from '@app/common/constants';
import { adaptSlimResult, adaptPicture } from './utils';
import { PictureRepository } from './repositories/picture.repository';
import { TrendRepository } from './repositories/trend.repository';
import { NetworkPictureRepository } from './repositories/networkPicture.repository';

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
		private readonly networkPictureRepository: NetworkPictureRepository,
	) {
		this.movieTtl = parseInt(configService.get('MOVIE_TTL', '2592000'), 10);
		this.tvTtl = parseInt(configService.get('TV_TTL', '604800'), 10);
		this.trendsTtl = parseInt(configService.get('TRENDS_TTL', '86400'), 10);
	}

	public async search(dto: SearchRequestDto): Promise<SearchResultDto> {
		const searchResult = await this.rmqService.send<
			GetTmdbSearch.Request,
			GetTmdbSearch.Response
		>(GetTmdbSearch.topic, dto);

		return {
			...searchResult,
			results: searchResult.results.map((searchResult) =>
				adaptSlimResult({
					searchResult: {
						...searchResult,
						media_type: searchResult['media_type'] ?? dto.mediaType,
					},
					config: this.configService,
				}),
			),
		};
	}

	public async getPicture(
		dto: GetPictureParams,
	): Promise<GetPictureResponseDto> {
		try {
			let picture = await this.pictureRepository.findPictureByTmdbId(dto);

			const getTmdbPicture = async () => {
				const pictureData = await this.rmqService.send<
					GetTmdbPicture.Request,
					GetTmdbPicture.ResponseMovie | GetTmdbPicture.ResponseTv
				>(GetTmdbPicture.topic, dto);

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
				GetTmdbPictureTrends.Request,
				GetTmdbPictureTrends.Response
			>(GetTmdbPictureTrends.topic, dto);

			const adaptResults = async (results) => {
				const resultArr = [];

				for (const result of results) {
					const resultObject = adaptSlimResult({
						searchResult: result,
						config: this.configService,
					});

					resultArr.push({ ...resultObject });
				}

				return resultArr;
			};

			const results = await adaptResults(rawTrendResponse.results);

			return {
				trendRequest: dto,
				trendResponse: {
					page: rawTrendResponse['page'],
					totalPages: rawTrendResponse['total_pages'],
					totalResults: rawTrendResponse['total_results'],
					results,
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

			if (lastUpdateDayPassed >= ttlInDay) {
				trend = await this.trendRepository.updateTrendsPage(
					await getTrend(),
				);
			}
		}

		return trend.trendResponse;
	}

	public async getNetworkPictures(
		dto: GetNetworkPicturesRequestDto,
	): Promise<GetNetworkPicturesResponseDto> {
		let networkPicture =
			await this.networkPictureRepository.findNetworkPicturesPage(dto);

		const getNetworkPictures = async () => {
			const rawNetworkPicturesResponse = await this.rmqService.send<
				TmdbGetTmdbNetworkPictures.Request,
				TmdbGetTmdbNetworkPictures.Response
			>(TmdbGetTmdbNetworkPictures.topic, dto);

			const adaptResults = async (results) => {
				const resultArr = [];

				for (const result of results) {
					const resultObject = adaptSlimResult({
						searchResult: result,
						config: this.configService,
					});

					resultArr.push({ ...resultObject });
				}

				return resultArr;
			};

			const results = await adaptResults(
				rawNetworkPicturesResponse.results,
			);

			return {
				networkPictureRequest: dto,
				networkPictureResponse: {
					page: rawNetworkPicturesResponse['page'],
					totalPages: rawNetworkPicturesResponse['total_pages'],
					totalResults: rawNetworkPicturesResponse['total_results'],
					results,
				},
			};
		};

		if (!networkPicture) {
			networkPicture =
				await this.networkPictureRepository.saveNetworkPictures(
					await getNetworkPictures(),
				);
		} else {
			const lastUpdateDayPassed = daysPassed({
				to: networkPicture['updatedAt'],
			});
			const ttlInDay = ttlToDay(this.trendsTtl);

			if (lastUpdateDayPassed >= ttlInDay) {
				networkPicture =
					await this.networkPictureRepository.updateNetworkPicturesPage(
						await getNetworkPictures(),
					);
			}
		}

		return networkPicture.networkPictureResponse;
	}

	public async getRecentViewedPictures(
		email: string,
	): Promise<GetPictureResponseDto[]> {
		try {
			const user = await this.rmqService.send<
				UsersFindUserByEmail.Request,
				UsersFindUserByEmail.Response[]
			>(UsersFindUserByEmail.topic, { email });

			return [];
		} catch (error) {
			throw new ApiError(error.statusCode, error.message);
		}
	}
}
