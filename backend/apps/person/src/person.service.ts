import { RMQService } from 'nestjs-rmq';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
	daysPassed,
	GetPersonDataDto,
	PersonDetailDataDto,
	TmdbGetTmdbPersonData,
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

	public async getPersonData({
		tmdbId,
	}: GetPersonDataDto): Promise<PersonDetailDataDto> {
		let person = await this.personRepository.findPersonByTmdbId(tmdbId);

		const getTmdbPersonaDetail = () => {
			try {
				return this.rmqService.send<
					TmdbGetTmdbPersonData.Request,
					TmdbGetTmdbPersonData.Response
				>(TmdbGetTmdbPersonData.topic, { tmdbId });
			} catch (error) {}
		};

		if (!person) {
			person = await this.personRepository.savePerson(
				personAdapter(await getTmdbPersonaDetail()),
			);
		} else if (
			daysPassed({
				to: person['updatedAt'],
			}) > 1
		) {
			person = await this.personRepository.updatePerson({
				id: person['id'],
				...personAdapter(await getTmdbPersonaDetail()),
			});
		}

		return person;
	}
}
