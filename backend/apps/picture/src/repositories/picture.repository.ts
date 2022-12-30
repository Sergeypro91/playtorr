import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { PictureEntity } from '../entities';
import { Picture } from '../models';

@Injectable()
export class PictureRepository {
	constructor(
		@InjectModel(Picture.name)
		private readonly pictureTorrentsModel: Model<Picture>,
	) {}

	async createPicture(pictureTorrents: PictureEntity) {
		const newPictureTorrents = new this.pictureTorrentsModel(
			pictureTorrents,
		);

		return newPictureTorrents.save();
	}

	async findPictureByImdbId(imdbId: string) {
		return this.pictureTorrentsModel
			.findOne({ imdbId: { $in: imdbId } })
			.exec();
	}

	async updatePicture({ imdbId, ...rest }: PictureEntity) {
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

	async deletePicture(imdbId: string) {
		return this.pictureTorrentsModel
			.deleteOne({ imdbId: { $in: imdbId } })
			.exec();
	}
}
