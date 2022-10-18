import { DBUserDto, FindUserByDto } from '@app/contracts';

export namespace UserFindUserBy {
	export const topic = 'user.findUserBy.command';

	export class Request extends FindUserByDto {}

	export class Response extends DBUserDto {}
}
