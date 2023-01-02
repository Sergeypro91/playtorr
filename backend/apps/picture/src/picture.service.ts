import { Injectable } from '@nestjs/common';
import { PictureRepository } from './repositories/picture.repository';
import { ApiError } from '@app/constants/common';
import {
	GetPictureDataDto,
	GetPictureTrendsDto,
	PictureDetailDataDto,
	SearchPictureDto,
	PicturePageDto,
	TmdbGetRequestDto,
} from '@app/contracts';
import { ConfigService } from '@nestjs/config';
import { RMQError } from 'nestjs-rmq';
import {
	convertTmdbToLocalPicture,
	convertTmdbToLocalPictureDetail,
} from './utils';
import { daysPassed } from '@app/utils';

@Injectable()
export class PictureService {
	constructor(
		private readonly configService: ConfigService,
		private readonly pictureRepository: PictureRepository,
	) {}

	async tmdbGetRequest({ apiVersion, apiRoute, queries }: TmdbGetRequestDto) {
		const apiUrl = this.configService.get('TMDB_URL');
		const apiKey = `api_key=${this.configService.get('TMDB_API_KEY')}`;
		const stringifyQueries = queries?.length
			? queries.join('&').concat('&')
			: '';

		console.log(
			'URL',
			`${apiUrl}/${apiVersion}/${apiRoute}?${stringifyQueries}${apiKey}`,
		);

		try {
			return await fetch(
				`${apiUrl}/${apiVersion}/${apiRoute}?${stringifyQueries}${apiKey}`,
			).then(async (response) => {
				if (response.ok) {
					return response.json();
				}

				const { status_message } = await response.json();

				throw new ApiError(
					response.statusText,
					response.status,
					status_message,
				);
			});
		} catch (error) {
			throw new RMQError(error.message, undefined, error.statusCode);
		}
	}

	async getPictureData({
		tmdbId,
		mediaType,
	}: GetPictureDataDto): Promise<PictureDetailDataDto> {
		let currDbPicture = await this.pictureRepository
			.findPictureByTmdbId(tmdbId, mediaType)
			.catch((error) => {
				throw new RMQError(error.message, undefined, error.code);
			});
		const getNewPicture = async () => {
			const queries = new URLSearchParams({
				language: 'ru',
				append_to_response: 'videos,images,credits',
			}).toString();
			const { imdb_id: imdbId } = await this.tmdbGetRequest({
				apiVersion: 3,
				apiRoute: `${mediaType}/${tmdbId}/external_ids`,
			});
			const picture = await this.tmdbGetRequest({
				apiVersion: 3,
				apiRoute: `${mediaType}/${tmdbId}`,
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

		const daysPassedSinceLastUpdate = daysPassed(
			new Date(),
			currDbPicture.lastUpdate,
		);

		if (daysPassedSinceLastUpdate >= 7) {
			this.pictureRepository
				.updatePicture(await getNewPicture())
				.catch((error) => {
					throw new RMQError(error.message, undefined, error.code);
				});
		}

		return currDbPicture;
	}

	async searchPicture(query: SearchPictureDto): Promise<PicturePageDto> {
		const queries = new URLSearchParams({
			...query,
			language: 'ru',
		}).toString();
		const page = await this.tmdbGetRequest({
			apiVersion: 3,
			apiRoute: 'search/multi',
			queries: [queries],
		});

		try {
			page.results = page.results.map((picture) =>
				convertTmdbToLocalPicture(picture),
			);
		} catch (error) {
			throw new RMQError(error.message, undefined, error.statusCode);
		}

		return page;
	}

	async getPictureTrends({
		mediaType,
		timeWindow,
		page,
	}: GetPictureTrendsDto): Promise<PicturePageDto> {
		const queries = new URLSearchParams({
			language: 'ru',
			page,
		}).toString();
		const picturesPage = await this.tmdbGetRequest({
			apiVersion: 3,
			apiRoute: `trending/${mediaType}/${timeWindow}`,
			queries: [queries],
		});

		try {
			picturesPage.results = picturesPage.results.map((picture) =>
				convertTmdbToLocalPicture(picture),
			);
		} catch (error) {
			throw new RMQError(error.message, undefined, error.statusCode);
		}

		return picturesPage;
	}
}