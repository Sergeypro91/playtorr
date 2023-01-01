import { Injectable } from '@nestjs/common';
import { PictureRepository } from './repositories/picture.repository';
import {
	GetPictureDataDto,
	PictureDataDto,
	TmdbGetRequestDto,
} from '@app/contracts';
import { ConfigService } from '@nestjs/config';
import { RMQError } from 'nestjs-rmq';
import { convertTmdbToLocalPicture } from './utils';
import { daysPassed } from '@app/utils';

@Injectable()
export class PictureService {
	constructor(
		private readonly configService: ConfigService,
		private readonly pictureRepository: PictureRepository,
	) {}

	tmdbGetRequest({ apiVersion, apiRoute, queries }: TmdbGetRequestDto) {
		const apiUrl = this.configService.get('TMDB_URL');
		const apiKey = `api_key=${this.configService.get('TMDB_API_KEY')}`;
		const stringifyQueries = queries?.length
			? queries.reduce(
					(queriesStr, query) => queriesStr.concat(`${query}&`),
					'',
			  )
			: '';

		console.log(
			'URL',
			`${apiUrl}/${apiVersion}/${apiRoute}?${stringifyQueries}${apiKey}`,
		);

		return fetch(
			`${apiUrl}/${apiVersion}/${apiRoute}?${stringifyQueries}${apiKey}`,
		)
			.then((response) => response.json())
			.catch((error) => {
				throw new RMQError(error.message, undefined, error.code);
			});
	}

	async getPictureData({
		tmdbId,
		mediaType,
	}: GetPictureDataDto): Promise<PictureDataDto> {
		let currDbPicture = await this.pictureRepository
			.findPictureByTmdbId(tmdbId)
			.catch((error) => {
				throw new RMQError(error.message, undefined, error.code);
			});
		const getNewPicture = async () => {
			const language = 'language=ru';
			const append = 'append_to_response=videos,images,credits';
			const { imdb_id: imdbId } = await this.tmdbGetRequest({
				apiVersion: 3,
				apiRoute: `${mediaType}/${tmdbId}/external_ids`,
			});
			const picture = await this.tmdbGetRequest({
				apiVersion: 3,
				apiRoute: `${mediaType}/${tmdbId}`,
				queries: [language, append],
			});

			return convertTmdbToLocalPicture({
				picture,
				tmdbId,
				// TODO Need auto update "PictureTorrens" imdbId when "Picture" imdbId change
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
}
