import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
	DBPictureTorrentsDto,
	ParsePictureTorrentsResponseDto,
	ParsePictureTorrentsRequestDto,
	GetTorrentsResponseDto,
} from '@app/common/contracts';
import { ApiError } from '@app/common/constants';
import { EnumStatus } from '@app/common/types';
import { parse } from '@app/common/utils';
import { PictureTorrentsRepository } from './repositories/pictureTorrents.repository';
import { PictureTorrentsEntity } from './entities';

@Injectable()
export class ParserService {
	constructor(
		private readonly configService: ConfigService,
		private readonly pictureTorrentsRepository: PictureTorrentsRepository,
	) {}

	public async parsePictureTorrents({
		imdbId = null,
		tmdbId,
		mediaType,
		searchQuery,
	}: ParsePictureTorrentsRequestDto): Promise<ParsePictureTorrentsResponseDto> {
		const user = {
			login: this.configService.get('NNM_LOGIN'),
			password: this.configService.get('NNM_PASSWORD'),
		};
		let currPictureTorrents: DBPictureTorrentsDto =
			await this.pictureTorrentsRepository.findPictureTorrentsByTmdbId({
				tmdbId,
				mediaType,
			});

		if (!currPictureTorrents) {
			const newPictureTorrents = new PictureTorrentsEntity({
				tmdbId,
				imdbId,
				mediaType,
				searchRequests: [],
			});

			currPictureTorrents =
				await this.pictureTorrentsRepository.createPictureTorrents(
					newPictureTorrents,
				);
		}

		const newSearchQueryData = {
			searchQuery: searchQuery.toLowerCase(),
			lastUpdate: new Date().toISOString(),
			searchStatus: EnumStatus.CREATED,
			message: undefined,
			trackers: [],
		};
		const [oldSearchQueryData] = currPictureTorrents.searchRequests.filter(
			(searchQueryData) =>
				searchQueryData.searchQuery === searchQuery.toLowerCase(),
		);
		const searchQueryData = oldSearchQueryData || newSearchQueryData;

		// If the torrent search was launched more than 24 hours ago
		try {
			await parse({
				user,

				searchQuery: searchQuery.toLowerCase(),
				searchQueryData,
			});

			const { searchRequests } = currPictureTorrents;
			const currSearchQueryDataId = searchRequests.findIndex(
				(searchQueryData) =>
					searchQueryData.searchQuery === searchQuery.toLowerCase(),
			);

			if (currSearchQueryDataId >= 0) {
				searchRequests[currSearchQueryDataId] = searchQueryData;
			} else {
				searchRequests.push(searchQueryData);
			}

			await this.pictureTorrentsRepository.updatePictureTorrentsByTmdbId({
				imdbId,
				tmdbId,
				mediaType,
				searchRequests,
			});
		} catch (error) {
			throw new ApiError(error.code, error.message);
		}

		return searchQueryData;
	}

	public async getPictureTorrents({
		tmdbId,
		mediaType,
		searchQuery,
	}: ParsePictureTorrentsRequestDto): Promise<GetTorrentsResponseDto[]> {
		try {
			return await this.pictureTorrentsRepository.getPictureTorrents({
				tmdbId,
				mediaType,
				searchQuery: searchQuery.toLowerCase(),
			});
		} catch (error) {
			throw new ApiError(error.code, error.message);
		}
	}
}
