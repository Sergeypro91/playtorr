import { PushUserRecentViewDto } from '@app/contracts';

export namespace UserPushUserRecentView {
	export const topic = 'user.pushUserRecentView.command';

	export class Request extends PushUserRecentViewDto {}

	export class Response extends PushUserRecentViewDto {}
}
