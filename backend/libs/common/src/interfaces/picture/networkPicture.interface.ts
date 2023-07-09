import { MediaType } from '@app/common/types';
import { IMovieSlim, ITvSlim } from '@app/common/interfaces';

export interface INetworkPicture {
	networkPictureRequest: INetworkPictureRequest;
	networkPictureResponse: INetworkPictureResponse;
}

export interface INetworkPictureRequest {
	mediaType: MediaType;
	network: number;
	page?: string | number;
}

export interface INetworkPictureResponse {
	results: (IMovieSlim | ITvSlim)[];
}
