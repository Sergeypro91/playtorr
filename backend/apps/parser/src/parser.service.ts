import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
	parse,
	EnumStatus,
	DBPictureTorrentsDto,
	GetTorrentsDto,
	TorrentInfoDto,
	TrackerDto,
	ApiError,
} from '@app/common';
import { PictureTorrentsRepository } from './repositories/pictureTorrents.repository';
import { PictureTorrentsEntity } from './entities';

@Injectable()
export class ParserService {
	constructor(
		private readonly configService: ConfigService,
		private readonly pictureTorrentsRepository: PictureTorrentsRepository,
	) {}

	public async parseTorrents({
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
			await this.pictureTorrentsRepository.findPictureTorrentsByTmdbId({
				tmdbId,
				mediaType,
			});

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
			trackers: [],
		};
		const [oldSearchQueryData] = currPictureTorrents.searchRequests.filter(
			(searchQueryData) => searchQueryData.searchQuery === searchQuery,
		);
		const searchQueryData = oldSearchQueryData || newSearchQueryData;

		// If the torrent search was launched more than 24 hours ago
		try {
			await parse({
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
			throw new ApiError(error.code, error.message);
		}

		return searchQueryData;
	}

	public async getPictureTorrents({
		tmdbId,
		mediaType,
		searchQuery,
	}: GetTorrentsDto): Promise<TrackerDto[]> {
		try {
			return await this.pictureTorrentsRepository.getPictureTorrents({
				tmdbId,
				mediaType,
				searchQuery,
			});
		} catch (error) {
			throw new ApiError(error.code, error.message);
		}
	}
}
