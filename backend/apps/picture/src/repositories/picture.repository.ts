import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { PictureEntity } from '../entities';
import { Picture } from '../models';
import { MediaType } from '@app/interfaces';

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
		return this.pictureModel.findOne({ imdbId }).exec();
	}

	async findPictureByTmdbId(tmdbId: string, mediaType: MediaType) {
		return this.pictureModel.findOne({ tmdbId, mediaType }).exec();
	}

	async updatePicture({ tmdbId, mediaType, ...rest }: PictureEntity) {
		return this.pictureModel
			.findOneAndUpdate(
				{ tmdbId, mediaType },
				{ $set: rest },
				{
					new: true,
				},
			)
			.exec();
	}

	async deletePicture(tmdbId: string, mediaType: MediaType) {
		return this.pictureModel.deleteOne({ tmdbId, mediaType }).exec();
	}
}
