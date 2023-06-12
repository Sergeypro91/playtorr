import { GetPreviewRequestDto, GetPreviewResultDto } from '../dtos';

export namespace GetPublicPreview {
	export const topic = 'publicPreview.getPublicPreview.command';

	export class Request extends GetPreviewRequestDto {}

	export class Response extends GetPreviewResultDto {}
}
