import {
	GetNetworkPicturesRequestDto,
	GetNetworkPicturesResponseDto,
} from '../dtos';

export namespace GetNetworkPictures {
	export const topic = 'Picture.getNetworkPictures.command';

	export class Request extends GetNetworkPicturesRequestDto {}

	export class Response extends GetNetworkPicturesResponseDto {}
}
