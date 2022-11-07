import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
	DBPictureTorrentsDto,
	GetTorrentsDto,
	TorrentFileDto,
} from '@app/contracts';
import { parseNnm } from './parsers/nnm/parser.nnm';
import { CHROME_DIR, NNM_URL } from '@app/constants/parser/parser.constants';
import { RMQError } from 'nestjs-rmq';
import { PictureTorrentsRepository } from './repositories/pictureTorrents.repository';
import { SearchStatus } from '@app/interfaces';
import { PictureTorrentsEntity } from './entities';

@Injectable()
export class ParserService {
	constructor(
		private readonly configService: ConfigService,
		private readonly pictureTorrentsRepository: PictureTorrentsRepository,
	) {}

	public async getTorrents({
		imdbId,
		searchQuery,
	}: GetTorrentsDto): Promise<TorrentFileDto[]> {
		const user = {
			login: this.configService.get('NNM_LOGIN'),
			password: this.configService.get('NNM_PASSWORD'),
		};
		let currPictureTorrents: DBPictureTorrentsDto =
			await this.pictureTorrentsRepository.findPictureTorrentsByImdbId(
				imdbId,
			);
		let updatedTorrentFiles: TorrentFileDto[] = [];

		if (!currPictureTorrents) {
			const newPictureTorrents = new PictureTorrentsEntity({
				imdbId,
				searchRequests: [],
			});

			currPictureTorrents =
				await this.pictureTorrentsRepository.createPictureTorrents(
					newPictureTorrents,
				);
		}

		const [currSearchQuery] = currPictureTorrents.searchRequests.filter(
			(searchRequest) => searchRequest.searchQuery === searchQuery,
		);

		const newSearchQuery = {
			searchQuery,
			lastUpdate: new Date().toISOString(),
			searchStatus: SearchStatus.CREATED,
			torrentFiles: [],
		};

		const { lastUpdate, searchStatus, torrentFiles } =
			currSearchQuery || newSearchQuery;

		const hoursDiffDate =
			Math.abs(new Date(lastUpdate).getTime() - new Date().getTime()) /
			(60 * 60 * 1000);

		if (hoursDiffDate < 24 && searchStatus !== SearchStatus.CREATED) {
			return torrentFiles;
		}

		try {
			updatedTorrentFiles = await parseNnm({
				url: NNM_URL,
				user,
				searchQuery,
				chromeDir: CHROME_DIR,
			});
			const updatedSearchRequests = (() => {
				if (currSearchQuery) {
					currSearchQuery.lastUpdate = new Date().toISOString();
					currSearchQuery.searchStatus = SearchStatus.FINISHED;
					currSearchQuery.torrentFiles = updatedTorrentFiles;
				} else {
					newSearchQuery.lastUpdate = new Date().toISOString();
					newSearchQuery.searchStatus = SearchStatus.FINISHED;
					newSearchQuery.torrentFiles = updatedTorrentFiles;
					currPictureTorrents.searchRequests.push(newSearchQuery);
				}
				return currPictureTorrents.searchRequests;
			})();

			await this.pictureTorrentsRepository.updatePictureTorrents({
				imdbId,
				searchRequests: updatedSearchRequests,
			});
		} catch (error) {
			throw new RMQError(error.message, undefined, error.code);
		}

		return updatedTorrentFiles;
	}
}
