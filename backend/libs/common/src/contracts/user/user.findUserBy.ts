import { DBUserDto, FindUserByDto } from './user.dto';

export namespace UserFindUserBy {
	export const topic = 'user.findUserBy.command';

	export class Request extends FindUserByDto {}

	export class Response extends DBUserDto {}
}
