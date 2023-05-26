import { RMQRoute, RMQValidate } from 'nestjs-rmq';
import { Body, Controller } from '@nestjs/common';
import { PersonGetPersonData } from '@app/common/contracts';
import { PersonService } from './person.service';

@Controller()
export class PersonController {
	constructor(private readonly personService: PersonService) {}

	@RMQValidate()
	@RMQRoute(PersonGetPersonData.topic)
	async getPersonData(
		@Body() dto: PersonGetPersonData.Request,
	): Promise<PersonGetPersonData.Response> {
		return this.personService.getPerson(dto);
	}
}
