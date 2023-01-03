import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
	DBPictureTorrentsDto,
	GetTorrentsDto,
	TorrentInfoDto,
} from '@app/contracts';
import { RMQError } from 'nestjs-rmq';
import { EnumStatus } from '@app/types';
import { hoursPassed } from '@app/utils';
import { PictureTorrentsRepository } from './repositories/pictureTorrents.repository';
import { PictureTorrentsEntity } from './entities';
import { parsers } from './parsers';

@Injectable()
export class ParserService {
	constructor(
		private readonly configService: ConfigService,
		private readonly pictureTorrentsRepository: PictureTorrentsRepository,
	) {}

	public async getTorrents({
		imdbId,
		tmdbId,
		mediaType,
		searchQuery,
	}: GetTorrentsDto): Promise<TorrentInfoDto> {
		const user = {
			login: this.configService.get('NNM_LOGIN'),
			password: this.configService.get('NNM_PASSWORD'),
		};
		let currPictureTorrents: DBPictureTorrentsDto =
			await this.pictureTorrentsRepository.findPictureTorrentsByTmdbId(
				tmdbId,
				mediaType,
			);

		if (!currPictureTorrents) {
			const newPictureTorrents = new PictureTorrentsEntity({
				imdbId,
				tmdbId,
				mediaType,
				searchRequests: [],
			});

			currPictureTorrents =
				await this.pictureTorrentsRepository.createPictureTorrents(
					newPictureTorrents,
				);
		}

		const newSearchQueryData = {
			searchQuery,
			lastUpdate: new Date().toISOString(),
			searchStatus: EnumStatus.CREATED,
			message: undefined,
			torrents: [],
		};
		const [oldSearchQueryData] = currPictureTorrents.searchRequests.filter(
			(searchQueryData) => searchQueryData.searchQuery === searchQuery,
		);
		const searchQueryData = oldSearchQueryData || newSearchQueryData;
		const hoursDiffDate = hoursPassed(
			new Date(),
			searchQueryData.lastUpdate,
		);

		// If the torrent search was launched less than 24 hours ago
		if (
			hoursDiffDate < 24 &&
			searchQueryData.searchStatus !== EnumStatus.CREATED
		) {
			return searchQueryData;
		}

		// If the torrent search was launched more than 24 hours ago
		try {
			await parsers({
				user,
				searchQuery,
				searchQueryData,
			});

			const { searchRequests } = currPictureTorrents;
			const currSearchQueryDataId = searchRequests.findIndex(
				(searchQueryData) =>
					searchQueryData.searchQuery === searchQuery,
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
			throw new RMQError(error.message, undefined, error.code);
		}

		return searchQueryData;
	}
}
