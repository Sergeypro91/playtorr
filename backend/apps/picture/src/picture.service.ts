import { Injectable } from '@nestjs/common';
import {
	daysPassed,
	ApiError,
	TmdbGetTmdbPictureTrends,
	PictureTrendsDtoDto,
} from '@app/common';
import {
	UserGetUser,
	TmdbSearchTmdb,
	TmdbGetTmdbPicture,
	GetPicture,
	PictureDto,
	GetPictureTrendsDto,
	SearchRequestDto,
	SearchResultDto,
	TmdbGetRequest,
} from '@app/common/contracts';
import { ConfigService } from '@nestjs/config';
import { RMQService } from 'nestjs-rmq';
import {
	adaptPictureTrends,
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

	public async tmdbGetRequest({ version, route, queries }: TmdbGetRequest) {
		try {
			const apiUrl = this.configService.get('TMDB_URL');
			const apiKey = `api_key=${this.configService.get('TMDB_API_KEY')}`;
			const stringifyQueries = queries?.length
				? queries.join('&').concat('&')
				: '';

			console.log(
				'URL',
				`${apiUrl}/${version}/${route}?${stringifyQueries}${apiKey}`,
			);

			return await fetch(
				`${apiUrl}/${version}/${route}?${stringifyQueries}${apiKey}`,
			).then(async (response) => {
				if (response.ok) {
					return response.json();
				}

				const { status_message } = await response.json();

				throw new ApiError(response.status, status_message);
			});
		} catch (error) {
			throw new ApiError(error.statusCode, error.message);
		}
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
					['media_type']: dto.mediaType,
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
