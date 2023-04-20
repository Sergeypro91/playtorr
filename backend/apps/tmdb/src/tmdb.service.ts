import { RMQService } from 'nestjs-rmq';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
	ApiError,
	GetTmdbPersonDto,
	GetTmdbPictureDto,
	SearchRequestTmdbDto,
	SearchResultTmdbDto,
	TmdbGetRequestDto,
	TmdbMovieDto,
	TmdbPersonDto,
	TmdbTvDto,
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

	public async searchTmdb({
		query,
		page,
	}: SearchRequestTmdbDto): Promise<SearchResultTmdbDto> {
		const queries = new URLSearchParams({
			query,
			page,
		}).toString();
		const [searchResult] = await promiseAllSettledHandle([
			this.tmdbGet({
				route: `search/multi`,
				queries: [queries],
			}),
		]);

		return searchResult;
	}

	public async getTmdbPerson({
		tmdbId,
	}: GetTmdbPersonDto): Promise<TmdbPersonDto> {
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

	public async getTmdbPicture({
		tmdbId,
		mediaType,
	}: GetTmdbPictureDto): Promise<TmdbMovieDto | TmdbTvDto> {
		const queries = new URLSearchParams({
			append_to_response: 'videos,images,credits',
		}).toString();
		const [picture, external_ids] = await promiseAllSettledHandle([
			this.tmdbGet({
				route: `${mediaType}/${tmdbId}`,
				queries: [queries],
			}),
			this.tmdbGet({
				route: `${mediaType}/${tmdbId}/external_ids`,
			}),
		]);

		return { ...picture, ...external_ids };
	}
}
