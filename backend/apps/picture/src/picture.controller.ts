import { RMQRoute, RMQValidate } from 'nestjs-rmq';
import { Body, Controller } from '@nestjs/common';
import {
	GetPicture,
	PictureSearch,
	GetPictureTrends,
	PictureGetRecentViewedPictures,
	GetNetworkPictures,
} from '@app/common/contracts';
import { PictureService } from './picture.service';

@Controller()
export class PictureController {
	constructor(private readonly pictureService: PictureService) {}

	@RMQValidate()
	@RMQRoute(PictureSearch.topic)
	async search(
		@Body() dto: PictureSearch.Request,
	): Promise<PictureSearch.Response> {
		return this.pictureService.search(dto);
	}

	@RMQValidate()
	@RMQRoute(GetPicture.topic)
	async getPictureData(
		@Body() dto: GetPicture.Request,
	): Promise<GetPicture.Response> {
		return this.pictureService.getPicture(dto);
	}

	@RMQValidate()
	@RMQRoute(PictureGetRecentViewedPictures.topic)
	async getRecentViewedPictures(
		email,
	): Promise<PictureGetRecentViewedPictures.Response[]> {
		return this.pictureService.getRecentViewedPictures(email);
	}

	@RMQValidate()
	@RMQRoute(GetPictureTrends.topic)
	async getPictureTrends(
		@Body() dto: GetPictureTrends.Request,
	): Promise<GetPictureTrends.Response> {
		return this.pictureService.getPictureTrends(dto);
	}

	@RMQValidate()
	@RMQRoute(GetNetworkPictures.topic)
	async getNetworkPictures(
		@Body() dto: GetNetworkPictures.Request,
	): Promise<GetNetworkPictures.Response> {
		return this.pictureService.getNetworkPictures(dto);
	}
}
