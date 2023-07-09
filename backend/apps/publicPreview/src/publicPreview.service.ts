import * as moment from 'moment';
import { RMQService } from 'nestjs-rmq';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MediaType, TimeWindow } from '@app/common/types';
import { GetPictureTrends, GetPreviewResultDto } from '@app/common/contracts';
import { adaptTrendToPreview } from './utils/adaptTrendToPreview';

@Injectable()
export class PublicPreviewService {
	trends: GetPreviewResultDto;

	constructor(
		private readonly rmqService: RMQService,
		private readonly configService: ConfigService,
	) {}

	public async getPreview(): Promise<GetPreviewResultDto> {
		const posterBaseUrl = `${this.configService.get(
			'POSTER_BASE_URL',
		)}/api/image/w780`;

		if (!this.trends || this.trends?.expires < Date.now()) {
			const rawTrends = await this.rmqService.send<
				GetPictureTrends.Request,
				GetPictureTrends.Response
			>(GetPictureTrends.topic, {
				mediaType: MediaType.ALL,
				timeWindow: TimeWindow.DAY,
			});

			this.trends = {
				expires: moment().add(1, 'day').startOf('day').unix(),
				sections: [
					{
						title: 'Popular today',
						tiles: rawTrends.results.map((picture, position) =>
							adaptTrendToPreview({
								picture,
								posterBaseUrl,
								position,
							}),
						),
					},
				],
			};
		}

		return this.trends;
	}
}
