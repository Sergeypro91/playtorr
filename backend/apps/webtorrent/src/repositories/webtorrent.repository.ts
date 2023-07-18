import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { GetTorrentDistributionInfoRequestDto } from '@app/common';
import { ConflictException, Injectable } from '@nestjs/common';
import { WEBTORRENT_INFO_EXIST_ERROR } from '@app/common/constants';
import { WebTorrent } from '../models';
import { WebTorrentEntity } from '../entities/webtorrent.entity';

@Injectable()
export class WebTorrentRepository {
	constructor(
		@InjectModel(WebTorrent.name)
		private readonly webTorrentModel: Model<WebTorrent>,
	) {}

	public async saveTorrentInfo(
		webTorrent: WebTorrentEntity,
	): Promise<WebTorrent> {
		const existWebTorrent = await this.findTorrentInfo(webTorrent);

		if (!existWebTorrent) {
			return new this.webTorrentModel(webTorrent).save();
		}

		throw new ConflictException(WEBTORRENT_INFO_EXIST_ERROR);
	}

	public async findTorrentInfo({
		tmdbId,
		mediaType,
		torrentUrl,
	}: GetTorrentDistributionInfoRequestDto): Promise<WebTorrent> {
		return this.webTorrentModel
			.findOne({
				tmdbId,
				mediaType,
				torrentUrl,
			})
			.exec();
	}

	public async updateTorrentInfo({
		tmdbId,
		// imdbId,
		mediaType,
		torrentUrl,
		...rest
	}: GetTorrentDistributionInfoRequestDto &
		Partial<WebTorrentEntity>): Promise<WebTorrent> {
		return this.webTorrentModel
			.findOneAndUpdate(
				{
					tmdbId,
					// imdbId,
					mediaType,
					torrentUrl,
				},
				{ $set: { ...rest } },
				{
					new: true,
				},
			)
			.exec();
	}

	public async deleteTorrentInfo({
		tmdbId,
		// imdbId,
		mediaType,
		torrentUrl,
	}: GetTorrentDistributionInfoRequestDto): Promise<WebTorrent> {
		return this.webTorrentModel
			.findOneAndDelete({
				tmdbId,
				// imdbId,
				mediaType,
				torrentUrl,
			})
			.exec();
	}
}
