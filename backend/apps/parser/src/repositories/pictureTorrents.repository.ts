import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { PictureTorrentsEntity } from '../entities';
import { PictureTorrents } from '../models';

@Injectable()
export class UserRepository {
	constructor(
		@InjectModel(PictureTorrents.name)
		private readonly pictureTorrentsModel: Model<PictureTorrents>,
	) {}

	async createPictureTorrents(pictureTorrents: PictureTorrentsEntity) {
		const newPictureTorrents = new this.pictureTorrentsModel(
			pictureTorrents,
		);

		return newPictureTorrents.save();
	}

	async findPictureTorrentsByImdbId(imdbId: string) {
		return this.pictureTorrentsModel
			.findOne({ imdbId: { $in: imdbId } })
			.exec();
	}

	async updatePictureTorrents({ imdbId, ...rest }: PictureTorrentsEntity) {
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

	async deletePictureTorrents(imdbId: string) {
		return this.pictureTorrentsModel
			.deleteOne({ imdbId: { $in: imdbId } })
			.exec();
	}
}
