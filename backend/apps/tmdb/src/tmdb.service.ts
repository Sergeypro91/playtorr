import { RMQService } from 'nestjs-rmq';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
	ApiError,
	GetTmdbPersonDataDto,
	TmdbGetRequestDto,
	TmdbPersonDataDto,
} from '@app/common';
import { promiseAllSettledHandle } from './utils';

@Injectable()
export class TmdbService {
	constructor(
		private readonly rmqService: RMQService,
		private readonly configService: ConfigService,
	) {}

	public async tmdbGet({ route, version, queries }: TmdbGetRequestDto) {
		const apiUrl = this.configService.get('TMDB_URL');
		const apiKey = `api_key=${this.configService.get('TMDB_API_KEY')}`;
		const apiVersion =
			version || this.configService.get('TMDB_API_VERSION');
		const apiQuery = queries?.join('&').concat('&') || '';
		const urlString = `${apiUrl}/${apiVersion}/${route}?${apiQuery}${apiKey}`;

		console.log({ urlString, apiQuery });

		return await fetch(urlString).then(async (response) => {
			if (response.ok) {
				return response.json();
			}

			const { status_message } = await response.json();

			throw new ApiError(response.status, status_message);
		});
	}

	public async getTmdbPersonData({
		tmdbId,
	}: GetTmdbPersonDataDto): Promise<TmdbPersonDataDto> {
		const [details, movies, tvs] = await promiseAllSettledHandle([
			this.tmdbGet({
				route: `person/${tmdbId}`,
			}),
			this.tmdbGet({
				route: `person/${tmdbId}/movie_credits`,
			}),
			this.tmdbGet({
				route: `person/${tmdbId}/tv_credits`,
			}),
		]);

		return { details, movies, tvs };
	}
}
