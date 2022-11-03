import { FindUserByDto } from '@app/contracts';
import { User } from 'apps/user/src/models';

export namespace UserFindUserBy {
	export const topic = 'user.findUserBy.command';

	export class Request extends FindUserByDto {}

	export class Response extends User {}
}
