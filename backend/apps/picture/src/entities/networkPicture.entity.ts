import { INetworkPicture } from '@app/common/interfaces';
import {
	GetNetworkPicturesRequestDto,
	GetNetworkPicturesResponseDto,
} from '@app/common/contracts';

export class NetworkPictureEntity implements INetworkPicture {
	networkPictureRequest: GetNetworkPicturesRequestDto;
	networkPictureResponse: GetNetworkPicturesResponseDto;

	constructor(networkPicture) {
		this.networkPictureRequest = networkPicture.networkPictureRequest;
		this.networkPictureResponse = networkPicture.networkPictureResponse;
	}
}
