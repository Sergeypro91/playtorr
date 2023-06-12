import * as moment from 'moment';
import { ensureDirSync, writeFile } from 'fs-extra';
import { RMQService } from 'nestjs-rmq';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MediaType, TimeWindow } from '@app/common/types';
import { ApiError, POSTER_DIDNT_FOUND } from '@app/common/constants';
import { GetPictureTrends, GetPreviewResultDto } from '@app/common/contracts';
import {
	adaptTrendToPreview,
	getTrendImage,
} from './utils/adaptTrendToPreview';

@Injectable()
export class PublicPreviewService {
	trends: GetPreviewResultDto;

	constructor(
		private readonly rmqService: RMQService,
		private readonly configService: ConfigService,
	) {}

	public async loadPoster(posterLink: string): Promise<void> {
		const poster = posterLink.replace('/', '');
		const fileDir = `${__dirname}/posters`;
		const filePath = `${fileDir}/${poster}`;
		const tmdbPosterUrl = `${this.configService.get('TMDB_API_IMG')}/w1280`;

		await ensureDirSync(fileDir);

		await fetch(`${tmdbPosterUrl}/${poster}`).then(async (response) => {
			if (response.ok) {
				const buffer = Buffer.from(await response.arrayBuffer());

				return writeFile(filePath, buffer);
			}

			throw new ApiError(response.status, POSTER_DIDNT_FOUND);
		});
	}

	public async getPreview(): Promise<GetPreviewResultDto> {
		const posterBaseUrl = this.configService.get('POSTER_BASE_URL');

		if (!this.trends || this.trends?.expires < Date.now()) {
			const rawTrends = await this.rmqService.send<
				GetPictureTrends.Request,
				GetPictureTrends.Response
			>(GetPictureTrends.topic, {
				mediaType: MediaType.ALL,
				timeWindow: TimeWindow.DAY,
			});

			this.trends = {
				expires: moment().add(1, 'day').startOf('day').valueOf(),
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

			for (const trend of rawTrends.results) {
				await this.loadPoster(getTrendImage(trend));
			}
		}

		return this.trends;
	}
}
