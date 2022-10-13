import { DBUserDto, FindUserByDto } from '@app/contracts/createUserDto';

export namespace UserFindUserBy {
	export const topic = 'user.findUserBy.command';

	export class Request extends FindUserByDto {}

	export class Response extends DBUserDto {}
}
