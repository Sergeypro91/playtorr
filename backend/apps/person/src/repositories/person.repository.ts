import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ConflictException, Injectable } from '@nestjs/common';
import { PERSON_EXIST_ERROR } from '@app/common';
import { Person } from '../model';
import { PersonEntity } from '../entities';

@Injectable()
export class PersonRepository {
	constructor(
		@InjectModel(Person.name)
		private readonly personModel: Model<Person>,
	) {}

	public async savePerson(person: PersonEntity): Promise<Person> {
		const existPerson = await this.findPersonByTmdbId(person.tmdbId);

		if (!existPerson) {
			return new this.personModel(person).save();
		}

		throw new ConflictException(PERSON_EXIST_ERROR);
	}

	public async findPersonById(id: string): Promise<Person> {
		return this.personModel.findOne({ id }).exec();
	}

	public async findPersonByImdbId(imdbId: string): Promise<Person> {
		return this.personModel.findOne({ imdbId }).exec();
	}

	public async findPersonByTmdbId(tmdbId: string): Promise<Person> {
		return this.personModel.findOne({ tmdbId }).exec();
	}

	public async updatePerson({
		id,
		...rest
	}: Partial<Person>): Promise<Person> {
		const now = new Date().toISOString();

		return this.personModel
			.findOneAndUpdate(
				{ id },
				{ $set: { ...rest, lastUpdate: now } },
				{
					new: true,
				},
			)
			.exec();
	}

	public async deletePerson(id: string): Promise<Person> {
		return this.personModel.findOneAndDelete({ id }).exec();
	}
}
