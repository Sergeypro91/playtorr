import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ConflictException, Injectable } from '@nestjs/common';
import { PictureTorrentsEntity } from '../entities';
import { PictureTorrents } from '../models';
import { PictureIdType } from '@app/interfaces';
import { PICTURE_TORRENTS_EXIST_ERROR } from '@app/constants';
import { TrackerDto } from '@app/contracts';

@Injectable()
export class PictureTorrentsRepository {
	constructor(
		@InjectModel(PictureTorrents.name)
		private readonly pictureTorrentsModel: Model<PictureTorrents>,
	) {}

	public async createPictureTorrents(pictureTorrents: PictureTorrentsEntity) {
		const { tmdbId, mediaType } = pictureTorrents;
		const existPictureTorrent = await this.findPictureTorrentsByTmdbId({
			tmdbId,
			mediaType,
		});

		if (!existPictureTorrent) {
			const newPictureTorrents = new this.pictureTorrentsModel(
				pictureTorrents,
			);

			return newPictureTorrents.save();
		}

		throw new ConflictException(PICTURE_TORRENTS_EXIST_ERROR);
	}

	public async findPictureTorrentsByImdbId(imdbId: string) {
		return this.pictureTorrentsModel.findOne({ imdbId }).exec();
	}

	public async getPictureTorrents({
		tmdbId,
		mediaType,
		searchQuery,
	}: PictureIdType & { searchQuery: string }): Promise<TrackerDto[]> {
		try {
			const result = await this.pictureTorrentsModel
				.findOne(
					{
						tmdbId,
						mediaType,
					},
					{ searchRequests: 1, _id: 0 },
				)
				.exec();

			if (result) {
				const { searchRequests } = result;

				return searchRequests
					.filter((query) => query.searchQuery == searchQuery)
					.map((query) => query.trackers)[0];
			}

			return [];
		} catch (error) {
			throw error;
		}
	}

	public async findPictureTorrentsByTmdbId({
		tmdbId,
		mediaType,
	}: PictureIdType) {
		return this.pictureTorrentsModel.findOne({ tmdbId, mediaType }).exec();
	}

	public async updatePictureTorrentsByImdbId({
		imdbId,
		...rest
	}: PictureTorrentsEntity) {
		return this.pictureTorrentsModel
			.findOneAndUpdate(
				{ imdbId },
				{ $set: rest },
				{
					new: true,
				},
			)
			.exec();
	}

	public async updatePictureTorrentsByTmdbId({
		tmdbId,
		mediaType,
		...rest
	}: PictureTorrentsEntity) {
		return this.pictureTorrentsModel
			.findOneAndUpdate(
				{ tmdbId, mediaType },
				{ $set: rest },
				{
					new: true,
				},
			)
			.exec();
	}

	public async deletePictureTorrents(imdbId: string) {
		return this.pictureTorrentsModel
			.deleteOne({ imdbId: { $in: imdbId } })
			.exec();
	}
}
