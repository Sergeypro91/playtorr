import { RMQError, RMQService } from 'nestjs-rmq';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
	ApiError,
	GetPersonDataDto,
	PersonDetailDataDto,
	TmdbGetRequestDto,
} from '@app/common';
import { PersonRepository } from './repositories';
import { personAdapter } from './utils';

@Injectable()
export class PersonService {
	constructor(
		private readonly rmqService: RMQService,
		private readonly configService: ConfigService,
		private readonly personRepository: PersonRepository,
	) {}

	public async tmdbGetRequest({
		apiVersion,
		apiRoute,
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
				`${apiUrl}/${apiVersion}/${apiRoute}?${stringifyQueries}${apiKey}`,
			);

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

	public async getPersonData({
		tmdbId,
	}: GetPersonDataDto): Promise<PersonDetailDataDto> {
		let person = await this.personRepository.findPersonByTmdbId(tmdbId);

		if (!person) {
			const personDetails = await this.tmdbGetRequest({
				apiVersion: 3,
				apiRoute: `person/${tmdbId}`,
			});
			const personMovie = await this.tmdbGetRequest({
				apiVersion: 3,
				apiRoute: `person/${tmdbId}/movie_credits`,
			});
			const personTV = await this.tmdbGetRequest({
				apiVersion: 3,
				apiRoute: `person/${tmdbId}/tv_credits`,
			});

			person = await this.personRepository.savePerson(
				personAdapter({
					details: personDetails,
					movie: personMovie,
					tv: personTV,
				}),
			);
		}

		return person;
	}
}
