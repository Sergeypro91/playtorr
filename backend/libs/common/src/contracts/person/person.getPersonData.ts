import { GetPersonDataDto, PersonDetailDataDto } from './person.dto';

export namespace PersonGetPersonData {
	export const topic = 'person.getPersonData.command';

	export class Request extends GetPersonDataDto {}

	export class Response extends PersonDetailDataDto {}
}
