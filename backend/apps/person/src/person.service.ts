import { RMQService } from 'nestjs-rmq';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
	GetPersonDataDto,
	PersonDetailDataDto,
	TmdbGetTmdbPerson,
} from '@app/common/contracts';
import { ApiError } from '@app/common/constants';
import { daysPassed } from '@app/common/utils';
import { adaptPerson } from './utils';
import { PersonRepository } from './repositories';

@Injectable()
export class PersonService {
	constructor(
		private readonly rmqService: RMQService,
		private readonly configService: ConfigService,
		private readonly personRepository: PersonRepository,
	) {}

	public async getPerson({
		tmdbId,
	}: GetPersonDataDto): Promise<PersonDetailDataDto> {
		try {
			let person = await this.personRepository.findPersonByTmdbId(tmdbId);

			const getTmdbPerson = () => {
				try {
					return this.rmqService.send<
						TmdbGetTmdbPerson.Request,
						TmdbGetTmdbPerson.Response
					>(TmdbGetTmdbPerson.topic, { tmdbId });
				} catch (error) {}
			};

			if (!person) {
				person = await this.personRepository.savePerson(
					adaptPerson(await getTmdbPerson()),
				);
			} else if (
				daysPassed({
					to: person['updatedAt'],
				}) > 1
			) {
				person = await this.personRepository.updatePerson({
					id: person['id'],
					...adaptPerson(await getTmdbPerson()),
				});
			}

			return person;
		} catch (error) {
			throw new ApiError(error.statusCode, error.message);
		}
	}
}
