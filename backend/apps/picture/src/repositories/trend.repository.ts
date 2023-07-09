import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ConflictException, Injectable } from '@nestjs/common';
import { GetPictureTrendsRequestDto } from '@app/common/contracts';
import { TrendEntity } from '../entities';
import { Trend } from '../models';

@Injectable()
export class TrendRepository {
	constructor(
		@InjectModel(Trend.name)
		private readonly pictureModel: Model<Trend>,
	) {}

	public async saveTrends(trend: TrendEntity): Promise<Trend> {
		const existTrend = await this.findTrendsPage(trend.trendRequest);

		if (!existTrend) {
			return new this.pictureModel(trend).save();
		}

		throw new ConflictException('Failed to save trends');
	}

	public async findTrendsPage(
		trendRequest: GetPictureTrendsRequestDto,
	): Promise<Trend> {
		return this.pictureModel.findOne({ trendRequest }).exec();
	}

	public async updateTrendsPage({
		trendRequest,
		trendResponse,
	}: TrendEntity): Promise<Trend> {
		return this.pictureModel
			.findOneAndUpdate(
				{ trendRequest },
				{ $set: { trendResponse } },
				{
					new: true,
				},
			)
			.exec();
	}

	public async deleteTrendsPage(trendRequest: GetPictureTrendsRequestDto) {
		return this.pictureModel
			.deleteOne({ trends: { $elemMatch: { trendRequest } } })
			.exec();
	}
}
