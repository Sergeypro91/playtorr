import { MediaType, TimeWindow } from '@app/common/types';
import { IMovieSlim, IPersonSlim, ITvSlim } from '@app/common/interfaces';

export interface ITrend {
	trendRequest: ITrendRequest;
	trendResponse: ITrendResponse;
}

export interface ITrendRequest {
	mediaType: MediaType;
	timeWindow: TimeWindow;
	page?: string | number;
}

export interface ITrendResponse {
	results: (IMovieSlim | ITvSlim | IPersonSlim)[];
}
