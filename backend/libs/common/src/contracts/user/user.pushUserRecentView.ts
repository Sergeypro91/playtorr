import { PushUserRecentViewDto } from './user.dto';

export namespace UserPushUserRecentView {
	export const topic = 'user.pushUserRecentView.command';

	export class Request extends PushUserRecentViewDto {}

	export class Response extends PushUserRecentViewDto {}
}
