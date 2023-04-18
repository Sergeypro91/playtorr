import { Injectable } from '@nestjs/common';
import {
	daysPassed,
	GetPictureDataDto,
	GetPictureTrendsDto,
	PictureDetailDataDto,
	SearchRequestDto,
	SearchResultDto,
	UserGetUser,
	PictureDataDto,
	TmdbSearchTmdb,
	TmdbGetRequestDto,
	ApiError,
} from '@app/common';
import { ConfigService } from '@nestjs/config';
import { RMQError, RMQService } from 'nestjs-rmq';
import {
	adapterSearchResult,
	adaptSearchResults,
	convertTmdbToLocalPictureDetail,
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
		try {
			const searchResult = await this.rmqService.send<
				TmdbSearchTmdb.Request,
				TmdbSearchTmdb.Response
			>(TmdbSearchTmdb.topic, dto);

			return {
				...searchResult,
				results: searchResult.results.map((searchResult) =>
					adaptSearchResults(searchResult),
				),
			};
		} catch (error) {}
	}

	public async tmdbGetRequest({
		version,
		route,
		queries,
	}: TmdbGetRequestDto) {
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
			throw new RMQError(error.message, undefined, error.statusCode);
		}
	}

	public async getPictureData({
		tmdbId,
		mediaType,
	}: GetPictureDataDto): Promise<PictureDetailDataDto> {
		try {
			let currDbPicture = await this.pictureRepository
				.findPictureByTmdbId({ tmdbId, mediaType })
				.catch((error) => {
					throw new RMQError(error.message, undefined, error.code);
				});
			const getNewPicture = async () => {
				const queries = new URLSearchParams({
					language: 'ru',
					append_to_response: 'videos,images,credits',
				}).toString();
				const { imdb_id: imdbId } = await this.tmdbGetRequest({
					version: 3,
					route: `${mediaType}/${tmdbId}/external_ids`,
				});
				const picture = await this.tmdbGetRequest({
					version: 3,
					route: `${mediaType}/${tmdbId}`,
					queries: [queries],
				});

				return convertTmdbToLocalPictureDetail({
					picture,
					tmdbId,
					imdbId,
					mediaType,
				});
			};

			if (!currDbPicture) {
				currDbPicture = await this.pictureRepository.savePicture(
					await getNewPicture(),
				);
			}

			const daysPassedSinceLastUpdate = daysPassed({
				to: currDbPicture.lastUpdate,
			});

			if (daysPassedSinceLastUpdate >= 7) {
				this.pictureRepository
					.updatePicture(await getNewPicture())
					.catch((error) => {
						throw new RMQError(
							error.message,
							undefined,
							error.statusCode,
						);
					});
			}

			return currDbPicture;
		} catch (error) {
			throw new RMQError(error.message, undefined, error.statusCode);
		}
	}

	public async getPictureTrends({
		mediaType,
		timeWindow,
		page,
	}: GetPictureTrendsDto): Promise<SearchResultDto> {
		try {
			const queries = new URLSearchParams({
				language: 'ru',
				page,
			}).toString();
			const picturesPage = await this.tmdbGetRequest({
				version: 3,
				route: `trending/${mediaType}/${timeWindow}`,
				queries: [queries],
			});

			picturesPage.results = picturesPage.results.map((picture) =>
				adapterSearchResult(picture),
			);

			return picturesPage;
		} catch (error) {
			throw new RMQError(error.message, undefined, error.statusCode);
		}
	}

	public async getRecentViewedPictures(
		email: string,
	): Promise<PictureDataDto[]> {
		try {
			const user = await this.rmqService.send<
				UserGetUser.Request,
				UserGetUser.Response[]
			>(UserGetUser.topic, { email });

			return await this.pictureRepository.findPicturesByTmdbId(
				user[0].recentViews,
			);
		} catch (error) {
			throw new RMQError(error.message, undefined, error.statusCode);
		}
	}
}
