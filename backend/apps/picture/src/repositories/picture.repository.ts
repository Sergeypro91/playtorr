import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ConflictException, Injectable } from '@nestjs/common';
import { PictureIdType, PICTURE_EXIST_ERROR } from '@app/common';
import { PictureEntity } from '../entities';
import { Picture } from '../models';

@Injectable()
export class PictureRepository {
	constructor(
		@InjectModel(Picture.name)
		private readonly pictureModel: Model<Picture>,
	) {}

	public async savePicture(picture: PictureEntity) {
		const existPicture = await this.findPictureByImdbId(picture.imdbId);

		if (!existPicture) {
			return new this.pictureModel(picture).save();
		}

		throw new ConflictException(PICTURE_EXIST_ERROR);
	}

	public async findPictureByImdbId(imdbId: string) {
		return this.pictureModel.findOne({ imdbId }).exec();
	}

	public async findPictureByTmdbId({ tmdbId, mediaType }: PictureIdType) {
		return this.pictureModel.findOne({ tmdbId, mediaType }).exec();
	}

	public async findPicturesByTmdbId(picturesIdType: PictureIdType[]) {
		return this.pictureModel
			.find(
				{
					tmdbId: picturesIdType.map(({ tmdbId }) => tmdbId),
					mediaType: picturesIdType.map(({ mediaType }) => mediaType),
				},
				{
					_id: 0,
					imdbId: 0,
					productionCompanies: 0,
					networks: 0,
					tagline: 0,
					runtime: 0,
					budget: 0,
					revenue: 0,
					releaseStatus: 0,
					inProduction: 0,
					seasons: 0,
					seasonsCount: 0,
					episodesCount: 0,
					nextEpisodeDate: 0,
					videos: 0,
					credits: 0,
					images: 0,
					lastUpdate: 0,
				},
			)
			.exec();
	}

	public async updatePicture({ tmdbId, mediaType, ...rest }: PictureEntity) {
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

	public async deletePicture({ tmdbId, mediaType }: PictureIdType) {
		return this.pictureModel
			.deleteOne({ pictures: { $elemMatch: { tmdbId, mediaType } } })
			.exec();
	}
}
