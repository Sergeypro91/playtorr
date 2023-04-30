import { GetPersonDataDto, PersonDetailDataDto } from '../dtos';

export namespace PersonGetPersonData {
	export const topic = 'person.getPersonData.command';

	export class Request extends GetPersonDataDto {}

	export class Response extends PersonDetailDataDto {}
}
