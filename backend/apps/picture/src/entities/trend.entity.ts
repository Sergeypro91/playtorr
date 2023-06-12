import { ITrend } from '@app/common/interfaces';
import {
	GetPictureTrendsRequestDto,
	GetPictureTrendsResponseDto,
} from '@app/common/contracts';

export class TrendEntity implements ITrend {
	trendRequest: GetPictureTrendsRequestDto;
	trendResponse: GetPictureTrendsResponseDto;

	constructor(trend) {
		this.trendRequest = trend.trendRequest;
		this.trendResponse = trend.trendResponse;
	}
}
