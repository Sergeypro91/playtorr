import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ConflictException, Injectable } from '@nestjs/common';
import { GetNetworkPicturesRequestDto } from '@app/common/contracts';
import { NetworkPictureEntity } from '../entities';
import { NetworkPicture } from '../models';

@Injectable()
export class NetworkPictureRepository {
	constructor(
		@InjectModel(NetworkPicture.name)
		private readonly networkPictureModel: Model<NetworkPicture>,
	) {}

	public async saveNetworkPictures(
		networkPicture: NetworkPictureEntity,
	): Promise<NetworkPicture> {
		const existNetworkPicture = await this.findNetworkPicturesPage(
			networkPicture.networkPictureRequest,
		);

		if (!existNetworkPicture) {
			return new this.networkPictureModel(networkPicture).save();
		}

		throw new ConflictException('Failed to save network picture');
	}

	public async findNetworkPicturesPage(
		networkPictureRequest: GetNetworkPicturesRequestDto,
	): Promise<NetworkPicture> {
		return this.networkPictureModel
			.findOne({ networkPictureRequest })
			.exec();
	}

	public async updateNetworkPicturesPage({
		networkPictureRequest,
		networkPictureResponse,
	}: NetworkPictureEntity): Promise<NetworkPicture> {
		return this.networkPictureModel
			.findOneAndUpdate(
				{ networkPictureRequest },
				{ $set: { networkPictureResponse } },
				{
					new: true,
				},
			)
			.exec();
	}

	public async deleteNetworkPicturesPage(
		networkPictureRequest: GetNetworkPicturesRequestDto,
	) {
		return this.networkPictureModel
			.deleteOne({
				networkPictures: { $elemMatch: { networkPictureRequest } },
			})
			.exec();
	}
}
