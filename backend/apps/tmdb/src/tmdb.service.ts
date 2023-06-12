import { RMQService } from 'nestjs-rmq';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiError, MediaType } from '@app/common';
import {
	GetTmdbPersonDto,
	GetTmdbPicture,
	GetTmdbPictureTrendsDto,
	SearchRequestTmdbDto,
	SearchResultTmdbDto,
	TmdbGetRequest,
	TmdbMovieDto,
	TmdbPersonDto,
	TmdbPictureTrendsDto,
	TmdbTvDto,
} from '@app/common/contracts';
import { promiseAllSettledHandle } from './utils';

@Injectable()
export class TmdbService {
	constructor(
		private readonly rmqService: RMQService,
		private readonly configService: ConfigService,
	) {}

	public async tmdbGet({ route, version, queries }: TmdbGetRequest) {
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
		page = 1,
	}: SearchRequestTmdbDto): Promise<SearchResultTmdbDto> {
		const queries = new URLSearchParams({
			query,
			page: `${page}`,
		}).toString();

		return this.tmdbGet({
			route: `search/multi`,
			queries: [queries],
		});
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
		appends,
	}: GetTmdbPicture): Promise<TmdbMovieDto | TmdbTvDto> {
		const queries = new URLSearchParams({
			append_to_response: appends || 'videos,images,credits',
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

	public async getTmdPictureTrends({
		mediaType,
		timeWindow,
		page = 1,
	}: GetTmdbPictureTrendsDto): Promise<TmdbPictureTrendsDto> {
		const queries = new URLSearchParams({
			page: `${page}`,
		}).toString();
		const expandedTrends = [];

		const trends = await this.tmdbGet({
			route: `trending/${mediaType}/${timeWindow}`,
			queries: [queries],
		});

		for (const trend of trends.results) {
			const details = await this.getTmdbPicture({
				tmdbId: `${trend['id']}`,
				imdbId: null,
				mediaType:
					trend['media_type'] === 'tv'
						? MediaType.TV
						: MediaType.MOVIE,
				appends: 'videos,images',
			});

			expandedTrends.push({
				...trend,
				videos: details['videos'],
				images: details['images'],
			});
		}

		return { ...trends, results: expandedTrends };
	}
}
