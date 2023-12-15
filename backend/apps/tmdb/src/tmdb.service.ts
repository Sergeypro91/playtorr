import { RMQService } from 'nestjs-rmq';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
	ApiError,
	GetTmdbNetworkPicturesRequestDto,
	GetTmdbNetworkPicturesResponseDto,
	MediaType,
} from '@app/common';
import {
	GetTmdbMovieResponseDto,
	GetTmdbPersonRequestDto,
	GetTmdbPersonResponseDto,
	GetTmdbPictureRequestDto,
	GetTmdbPictureTrendsRequestDto,
	GetTmdbPictureTrendsResponseDto,
	GetTmdbSearchRequestDto,
	GetTmdbSearchResultDto,
	GetTmdbTvResponseDto,
	TmdbGetRequest,
} from '@app/common/contracts';
import { promiseAllSettledHandle } from './utils';
import moment from 'moment';

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
		mediaType,
		page = 1,
	}: GetTmdbSearchRequestDto): Promise<GetTmdbSearchResultDto> {
		const queries = new URLSearchParams({
			query,
			page: `${page}`,
		}).toString();

		return this.tmdbGet({
			route: `search/${
				mediaType === MediaType.ALL ? 'multi' : mediaType
			}`,
			queries: [queries],
		});
	}

	public async getTmdbPerson({
		tmdbId,
	}: GetTmdbPersonRequestDto): Promise<GetTmdbPersonResponseDto> {
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
	}: GetTmdbPictureRequestDto): Promise<
		GetTmdbMovieResponseDto | GetTmdbTvResponseDto
	> {
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
	}: GetTmdbPictureTrendsRequestDto): Promise<GetTmdbPictureTrendsResponseDto> {
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
				mediaType: trend['media_type'] ?? mediaType,
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

	public async getTmdbNetworkPictures({
		mediaType,
		network,
		page,
	}: GetTmdbNetworkPicturesRequestDto): Promise<GetTmdbNetworkPicturesResponseDto> {
		const queries = new URLSearchParams({
			'with_networks': `${network}`,
			'sort_by': 'popularity.desc',
			'air_date.lte': moment().format('YYYY-MM-DD'),
			'page': `${page}`,
		}).toString();
		const expandedNetworkPictures = [];

		const pictures = await this.tmdbGet({
			route: `discover/${mediaType}`,
			queries: [queries],
		});

		for (const picture of pictures.results) {
			const details = await this.getTmdbPicture({
				tmdbId: `${picture['id']}`,
				imdbId: null,
				mediaType: picture['media_type'] ?? mediaType,
				appends: 'videos,images',
			});

			expandedNetworkPictures.push({
				...picture,
				media_type: picture['media_type'] ?? mediaType,
				videos: details['videos'],
				images: details['images'],
			});
		}

		return { ...pictures, results: expandedNetworkPictures };
	}
}
