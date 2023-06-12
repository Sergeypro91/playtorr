import { RMQService } from 'nestjs-rmq';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
	UserGetUser,
	TmdbSearchTmdb,
	TmdbGetTmdbPicture,
	TmdbGetTmdbPictureTrends,
	GetPicture,
	PictureDto,
	SearchResultDto,
	SearchRequestDto,
	GetPictureTrendsDto,
	PictureTrendsDtoDto,
} from '@app/common/contracts';
import { daysPassed } from '@app/common/utils';
import { ApiError } from '@app/common/constants';
import {
	adaptSearchResult,
	adaptPicture,
	adaptPictureTrendsResult,
} from './utils';
import { PictureRepository } from './repositories/picture.repository';

@Injectable()
export class PictureService {
	constructor(
		private readonly rmqService: RMQService,
		private readonly configService: ConfigService,
		private readonly pictureRepository: PictureRepository,
	) {}

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

	public async getPicture(dto: GetPicture): Promise<PictureDto> {
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
			} else if (
				daysPassed({
					to: picture['updatedAt'],
				}) >= 7
			) {
				picture = await this.pictureRepository.updatePicture(
					await getTmdbPicture(),
				);
			}

			return picture;
		} catch (error) {
			throw new ApiError(error.statusCode, error.message);
		}
	}

	public async getPictureTrends(
		dto: GetPictureTrendsDto,
	): Promise<PictureTrendsDtoDto> {
		const pictureTrendsResult = await this.rmqService.send<
			TmdbGetTmdbPictureTrends.Request,
			TmdbGetTmdbPictureTrends.Response
		>(TmdbGetTmdbPictureTrends.topic, dto);

		return {
			...pictureTrendsResult,
			results: pictureTrendsResult.results.map((searchResult) =>
				adaptPictureTrendsResult({
					...searchResult,
				}),
			),
		};
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
