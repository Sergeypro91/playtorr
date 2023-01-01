import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { PictureEntity } from '../entities';
import { Picture } from '../models';

@Injectable()
export class PictureRepository {
	constructor(
		@InjectModel(Picture.name)
		private readonly pictureModel: Model<Picture>,
	) {}

	async savePicture(picture: PictureEntity) {
		const newPicture = new this.pictureModel(picture);

		return newPicture.save();
	}

	async findPictureByImdbId(imdbId: string) {
		return this.pictureModel.findOne({ imdbId: { $in: imdbId } }).exec();
	}

	async findPictureByTmdbId(tmdbId: number) {
		return this.pictureModel.findOne({ tmdbId: { $in: tmdbId } }).exec();
	}

	async updatePicture({ tmdbId, ...rest }: PictureEntity) {
		return this.pictureModel
			.findOneAndUpdate(
				{ tmdbId },
				{ $set: rest },
				{
					new: true,
				},
			)
			.exec();
	}

	async deletePicture(tmdbId: string) {
		return this.pictureModel.deleteOne({ tmdbId: { $in: tmdbId } }).exec();
	}
}
